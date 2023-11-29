---
title: "How to Use a Table Load Tool to Batch Puts into HBase/MapR Database"
date: 2020-10-15T06:28:44.470Z
author: Terry He 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","opensource", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Terry He",
"publish": "2015-04-22T07:00:00.000Z",
"tags": "nosql"
```

---

Apache HBase is an in-Hadoop database that delivers wide-column schema flexibility with strongly consistent reads and writes. Clients can access HBase data through either a native Java API, a Thrift or REST gateway, or now through a C API, making it very easy to access data. MapR Database, yet another in-Hadoop database has the same HBase APIs, but provides enterprise-grade features for production deployments of HBase applications.

Put, Get and Scan are some of the prominent programming APIs that get used in the context of HBase applications. For certain write-heavy workloads, Put operations can get slow, so batching these Put operations is a commonly used technique to increase the overall throughput of the system. The following program illustrates a table load tool, which is a great utility program that can be used for batching Puts into an HBase/MapR Database table. The program creates a simple HBase table with a single column within a column family and inserts 100000 rows with 100 bytes of data. The batch size for the Puts is set to 500 in this example.

```python
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.zip.CRC32;

import org.apache.hadoop.hbase.util.Pair;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableExistsException;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.util.Bytes;

public class LoadTableMTBatch {

	static long uniqueSeed = System.currentTimeMillis();
	static long[] count;
	static long[] latency;
	static int[] keySizes;
	public static long printPerNum = 10000;
	public static boolean noCRC = false;
	public static long keySize = 8;
	public static long startRow = 0;
	public static int batchSize = 500;
	public static int preSplit = 1; //Used as a demo - Not accurated key distribution
	public static boolean flush = false;
	public static boolean autoFlush = false;
        public static final String KEY_PREFIX="user";
	public static final long startKey = 0L;
	public static final long endKey = 999999999999999L;
	public static final String HBASE_RESOURCE_NAME = "/opt/mapr/hbase/hbase-0.98.9/conf/hbase-site.xml";
	public static String ZOOKEEPER_NODES = "localhost"; //Default to localhost, only needed for accessing HBase
	public static final Pair ZOOKEEPER_SETTINGS = new Pair(
			"hbase.zookeeper.quorum", ZOOKEEPER_NODES);

	public static void usage(String arg) {
		System.err.println("bad token: " + arg);
		System.err
				.println("loadMT -rows <100000> -valuesize <100 bytes="">  -debug -path  -threads <10> -batchSize <500> -numCF <1> -numC <1> -preSplit <1> -zookeeperNodes  -AutoFlush -flush");
		System.exit(1);
	}

	public static void main(String[] args) throws java.io.IOException {
		Configuration conf = HBaseConfiguration.create();
		String tableName = null;
		long numRows = 100000;
		long numCF = 1;
		long numC = 1;
		long valueSize = 100;
		int numThreads = 10;
		boolean augment = false;

		for (int i = 0; i < args.length; ++i) {
			if (args[i].equals("-rows")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				numRows = Long.parseLong(args[i]);
			} else if (args[i].equals("-path")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				tableName = args[i];
			} else if (args[i].equals("-debug")) {
				conf.set("fs.mapr.trace", "debug");
			} else if (args[i].equals("-valuesize")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				valueSize = Long.parseLong(args[i]);
			} else if (args[i].equals("-threads")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				numThreads = Integer.parseInt(args[i]);
			} else if (args[i].equals("-p")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				printPerNum = Long.parseLong(args[i]);
			} else if (args[i].equals("-hbase")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				conf.addResource(new Path(args[i]));
			} else if (args[i].equals("-numCF")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				numCF = Integer.parseInt(args[i]);
			} else if (args[i].equals("-numC")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				numC = Integer.parseInt(args[i]);
			} else if (args[i].equals("-batchSize")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				batchSize = Integer.parseInt(args[i]);
			} else if (args[i].equals("-preSplit")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				preSplit = Integer.parseInt(args[i]);
			} else if (args[i].equals("-zookeeperNodes")) {
				i++;
				if (i >= args.length)
					usage(args[i]);
				ZOOKEEPER_NODES = args[i];
			} else if (args[i].equals("-AutoFlush")) {
				autoFlush = true;
			} else if (args[i].equals("-flush")) {
				flush = true;
			} else {
				usage(args[i]);
			}
		}
		if (tableName == null) {
			System.out.println("Must specify path");
			usage("path");
		}
		LoadTableMTBatch lt = new LoadTableMTBatch();
		try {
			LoadTableMTBatch.init(conf, tableName, numRows, numCF, numC,
					valueSize, augment);
			lt.loadTable(conf, tableName, numRows, numCF, numC, valueSize,
					numThreads);
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(-1);
		}
	}

	public void generateKeySizes() {
		Random rand = new Random(uniqueSeed);
		keySizes = new int[10];
		keySizes[0] = rand.nextInt(5) + 5;
		keySizes[1] = rand.nextInt(40) + 10;
		keySizes[2] = rand.nextInt(50) + 50;
		keySizes[3] = rand.nextInt(400) + 100;
		keySizes[4] = rand.nextInt(500) + 500;
		keySizes[5] = rand.nextInt(4000) + 1000;
		keySizes[6] = rand.nextInt(5000) + 5000;
		keySizes[7] = rand.nextInt(10000) + 10000;
		keySizes[8] = rand.nextInt(12000) + 20000;
		keySizes[9] = rand.nextInt(32 * 1024 - 1) + 1;
	}

	public void loadTable(Configuration conf, String tableName, long numRows,
			long numCF, long numC, long valueSize, int numThreads)
			throws Exception {
		Thread[] loadThreads = new Thread[numThreads];
		count = new long[numThreads];
		latency = new long[numThreads];

		if (keySize < 1) {
			generateKeySizes();
		}

		long offset = (endKey - startKey) / numThreads;
		for (int i = 0; i < loadThreads.length; i++) {
			latency[i] = 0;
			if (preSplit <= 1000="" 1)="" {="" loadthreads[i]="new" thread(new="" loadtablerunnable(conf,="" tablename,="" numrows,="" numcf,="" numc,="" valuesize,="" i,="" numthreads,="" batchsize));="" }="" else="" batchsize,="" startkey="" +="" i="" *="" offset,="" ((i="" offset)="" -="" 1));="" for="" (int="" <="" loadthreads.length;="" i++)="" loadthreads[i].start();="" long="" inserts="0," insertsold="0," rate="0," overallrate="0," ta="0," tb="0," t0="0," elapsedtime="0;" averagelatency="0;" minlatency="0;" maxlatency="0;" boolean="" alive="true;" 1;="" while="" (true)="" if="" (loadthreads[i].isalive())="" insertsold)="" (ta="" tb);="" t0);="" elapsedtime;="" min="" max="" average="" latency="" synchronized="" (latency)="" arrays.sort(latency);="" 1];="" latency.length);="" system.out.println("elapsed="" time:="" "="" ";="" inserts:="" current="" sec;="" overall="" batchsize="" 1000000l="" "ms;"="" "ms");="" (!alive)="" break;="" print="" out="" interval="" thread.sleep(1000);="" loadthreads[i].join();="" public="" static="" getsum(long[]="" array)="" sum="0;" (long="" l="" :="" return="" sum;="" void="" createtable(configuration="" conf,="" string="" numcf)="" throws="" exception="" hbaseadmin="" admin="new" hbaseadmin(conf);="" system.out.println("created="" object");="" htabledescriptor="" des="new" htabledescriptor(tablename.getbytes());="" numcf;="" des.addfamily(new="" hcolumndescriptor("f"="" i));="" try="" (presplit="" admin.createtable(des);="" byte[]="" startkeybyte="Bytes.toBytes(KEY_PREFIX+startKey);" endkeybyte="Bytes.toBytes(KEY_PREFIX+endKey);" admin.createtable(des,="" startkeybyte,="" endkeybyte,="" presplit);="" catch="" (tableexistsexception="" te)="" te.printstacktrace();="" (ioexception="" ie)="" ie.printstacktrace();="" init(configuration="" augment)="" ioexception,="" (augment)="" htable="" intable="new" htable(conf,="" tablename);="" result="" infores="inTable.get(new" get("homerow".getbytes()));="" startrow="inTable.incrementColumnValue("homeRow".getBytes()," "f0".getbytes(),="" "c0".getbytes(),="" numrows)="" numrows;="" numcf="Bytes.toLong(infoRes.getValue("f0".getBytes()," "c1".getbytes()));="" numc="Bytes.toLong(infoRes.getValue("f0".getBytes()," "c2".getbytes()));="" uniqueseed="Bytes.toLong(infoRes.getValue("f0".getBytes()," "c3".getbytes()));="" keysize="Bytes.toLong(infoRes.getValue("f0".getBytes()," "c4".getbytes()));="" createtable(conf,="" numcf);="" put="" info="new" put("homerow".getbytes());="" info.add("f0".getbytes(),="" bytes.tobytes(numrows));="" "c1".getbytes(),="" bytes.tobytes(numcf));="" "c2".getbytes(),="" bytes.tobytes(numc));="" "c3".getbytes(),="" bytes.tobytes(uniqueseed));="" "c4".getbytes(),="" bytes.tobytes(keysize));="" intable.put(info);="" intable.flushcommits();="" load(configuration="" int="" threadnum,="" startkey,="" endkey)="" ioexception="" system.out.println("starting="" load="" thread="" threadnum);="" threadnum="" start="" key="" (key_prefix="" startkey)="" end="" :"="" endkey));="" family;="" column;="" p="null;" counter="0;" table="null;" random="" rand="new" random(uniqueseed);="" incrementrandom(rand,="" (int)="" startrow);="" endrow="startRow" htable(createhbaseconfiguration(),="" tablename.getbytes());="" table.setautoflush(autoflush);="" startrow;="" endrow;="" byte[][]="" rowkeys="new" byte[batchsize][];="" families="new" columns="new" values="new" batch="0;" batchsize;="" batch++)="" rowkey="new" byte[(int)="" keysize];="" (keysize="" 0)="" randsize="keySizes[rand.nextInt(Integer.MAX_VALUE)" %="" 10];="" numthreads="" 1);="" byte[randsize="" stringbuilder="" keybuilder="new" stringbuilder();="" keybuilder.append(i);="" keybuilder.append(batch);="" createkey(rowkey,="" long.valueof(keybuilder.tostring())="" ^="" uniqueseed);="" rowkeys[batch]="rowKey;" generate="" endkey);="" value="" valuesize];="" fillbuffer(valuesize,="" value,="" batch);="" values[batch]="value;" cf="" c="" family="f" (numcf="" families[batch]="family.getBytes();" column="c" (numc="" columns[batch]="column.getBytes();" list="" puts="new" arraylist();="" starttime="System.nanoTime();" put(rowkeys[batch]);="" p.add(families[batch],="" columns[batch],="" values[batch]);="" puts.add(p);="" table.put(puts);="" (flush)="" table.flushcommits();="" (exception="" e)="" e.printstacktrace();="" endtime="System.nanoTime();" latency[threadnum]="(endTime" starttime);="" count[threadnum]="counter;" finally="" (table="" !="null)" table.close();="" incrementrandom(random="" rand,="" num)="" num;="" rand.nextint();="" createkey(byte[]="" buffer,="" seed)="" random(seed);="" crc32="" chksum="new" crc32();="" rand.nextbytes(buffer);="" chksum.update(buffer);="" return;="" createkeyforregion(byte[]="" longrandom().nextlong(endkey="" startkey);="" buffer="Bytes.toBytes(KEY_PREFIX" key);="" buffer;="" fillbuffernocrc(long="" newseed="seed" system.currenttimemillis();="" random(newseed);="" fillbuffer(long="" chksum.getvalue();="" configuration="" createhbaseconfiguration()="" conf="HBaseConfiguration.create();" conf.addresource(new="" path(hbase_resource_name));="" conf.set((string)zookeeper_settings.getfirst(),="" (string)="" zookeeper_settings.getsecond());="" conf;="" class="" loadtablerunnable="" implements="" runnable="" private="" tablename;="" valuesize;="" threadnum;="" endkey="-1;" loadtablerunnable(configuration="" batchsize)="" this.conf="conf;" this.tablename="tableName;" this.numrows="numRows;" this.numcf="numCF;" this.numc="numC;" this.valuesize="valueSize;" this.threadnum="threadNum;" this.numthreads="numThreads;" this.batchsize="batchSize;" this.startkey="startKey;" this.endkey="endKey;" run()="" (endkey="=" -1)="" loadtablemtbatch.load(conf,="" 0,="" 0);="" system.exit(-1);="" longrandom="" extends="" final="" serialversionuid="1L;" **="" generating="" a="" in="" the="" range="" of="" 0<="value<=n" @param="" n="" @return="" nextlong(long="" n)="" (n="" throw="" new="" illegalargumentexception();="" small="" use="" nextint="" and="" cast="" (long)="" nextint((int)="" n);="" large="" both="" high="" low="" ints="" highlimit="(int)">> 32);
			long high = (long) nextInt(highLimit) << 32;
			long low = ((long) nextInt()) & 0xffffffffL;
			return (high | low);
		}
	}

}
```

---

<a id="product-names" />
## MapR to HPE Product Naming
| Historical MapR Product Name | New Product Name |
| --- | --- |
| MapR (Document) Database Enterprise Premier | HPE Ezmeral Data Fabric Document Database |