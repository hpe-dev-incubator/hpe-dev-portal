import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Tabs,
  Menu,
  Text,
  Grommet,
  Box,
  ResponsiveContext,
} from 'grommet';
import { FormDown } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { BlogTabContent } from '..';

const customTheme = deepMerge(hpe, {
  tab: {
    pad: {
      vertical: '0',
      horizontal: '0',
    },
  },
});

function BlogTabs({ data, columns }) {
  const [index, setIndex] = useState(0);
  const [platform, setPlatform] = useState(false);
  const [previousTab, setPreviousTab] = useState(0);
  const [platformContent, setPlatformContent] = useState({
    data: data.allBlogs,
  });
  const [openSourceContent, setOpenSourceContent] = useState({
    data: data.openSourceBlogs,
  });
  const onActive = (nextIndex) => setIndex(nextIndex);
  const size = useContext(ResponsiveContext);

  const [activeBlogTab, setActiveBlogTab] = useState('');
  const [platformData, setPlatformData] = useState('');
  const [openSourceData, setOpenSourceData] = useState('');
  const [activePlatform, setActivePlatform] = useState('');
  const [activeOpenSource, setActiveOpenSource] = useState('');

  const totalAllBlogsCount = data.allBlogsCount.totalCount;
  const totalOpenSourceBlogsCount = data.openSourceBlogsCount.totalCount;
  const totalGreenLakeBlogsCount = data.greenlakeBlogsCount.totalCount;
  const totalOthersBlogsCount = data.othersBlogsCount.totalCount;

  useEffect(() => {
    // loads persisted platform data when the user goes back to the blog page
    if (platformData && platformData.nodes) {
      setPlatformContent({ data: platformData });
    }
    if (openSourceData && openSourceData.nodes) {
      setOpenSourceContent({ data: openSourceData });
    }

    // loads persisted blog tab index # when user goes back to the blog page
    if (activeBlogTab) {
      setIndex(activeBlogTab);
      setPlatform(true);
    }
  }, [platformData, openSourceData, activeBlogTab]);

  const platforms = {
    ezmeralBlogs: {
      label: 'HPE Ezmeral Software',
      count: data?.ezmeralBlogsCount?.totalCount || 0,
    },
    dataFabricBlogs: {
      label: 'HPE Ezmeral Data Fabric',
      count: data?.dataFabricBlogsCount?.totalCount || 0,
    },
    projectDataMapBlogs: {
      label: 'Project Data Map',
      count: data?.projectdataMapBlogsCount?.totalCount || 0,
    },
    alletraBlogs: {
      label: 'HPE Alletra',
      count: data?.alletraBlogsCount?.totalCount || 0,
    },
    // deepLearningBlogs: {
    //   label: 'HPE Deep Learning Cookbook',
    //   count: data?.deepLearningBlogsCount.totalCount,
    // },
    threeParBlogs: {
      label: 'HPE 3PAR and Primera',
      count: data?.threeParBlogsCount?.totalCount || 0,
    },
    nimbleBlogs: {
      label: 'HPE Nimble Storage',
      count: data?.nimbleBlogsCount?.totalCount || 0,
    },
    oneviewBlogs: {
      label: 'HPE OneView',
      count: data?.oneviewBlogsCount?.totalCount || 0,
    },
    oneviewDashboardBlogs: {
      label: 'HPE OneView Global Dashboard',
      count: data?.oneviewDashboardBlogsCount?.totalCount || 0,
    },
    iloBlogs: {
      label: 'iLO RESTful API',
      count: data?.iloBlogsCount?.totalCount || 0,
    },
    dsccBlogs: {
      label: 'Data Service Cloud Console',
      count: data?.dsccBlogsCount?.totalCount || 0,
    },
    crayBlogs: {
      label: 'HPE Cray Programming Environment',
      count: data?.crayBlogsCount?.totalCount || 0,
    },
    swarmBlogs: {
      label: 'HPE Swarm Learning',
      count: data?.swarmBlogsCount?.totalCount || 0,
    },
    hpeNonstopBlogs: {
      label: 'HPE NonStop',
      count: data?.hpeNonstopBlogsCount?.totalCount || 0,
    },
  };

  const opensource = {
    kubeDirectorBlogs: {
      label: 'KubeDirector',
      count: data?.kubeDirectorBlogsCount?.totalCount || 0,
    },
    spiffeBlogs: {
      label: 'Spiffee and Spire Projects',
      count: data?.spiffeBlogsCount?.totalCount || 0,
    },
    chapelBlogs: {
      label: 'Chapel',
      count: data?.chapelBlogsCount?.totalCount || 0,
    },
    grommetBlogs: {
      label: 'Grommet',
      count: data.grommetBlogsCount?.totalCount || 0,
    },
    determinedBlogs: {
      label: 'Determined AI',
      count: data.determinedBlogsCount?.totalCount || 0,
    },
    smartSimBlogs: {
      label: 'SmartSim',
      count: data.smartSimBlogsCount?.totalCount || 0,
    },
  };

  const platformsMenuItems = Object.entries(data)
    .filter(
      (item) =>
        Object.prototype.hasOwnProperty.call(platforms, item[0]) &&
        platforms[item[0]].count > 0,
    )
    .map((item, i) => {
      return {
        label: `${platforms[item[0]].label} (${platforms[item[0]].count})`,
        active: platforms[item[0]].label === activePlatform,
        onClick: () => {
          setActiveBlogTab(index);
          setPlatformData(item[1]);
          setPlatformContent({ key: i, data: item[1] });
          setActivePlatform(platforms[item[0]].label);
        },
      };
    });

  const openSourceMenuItems = Object.entries(data)
    .filter(
      (item) =>
        Object.prototype.hasOwnProperty.call(opensource, item[0]) &&
        opensource[item[0]].count > 0,
    )
    .map((item, i) => {
      return {
        label: `${opensource[item[0]].label} (${opensource[item[0]].count})`,
        active: opensource[item[0]].label === activeOpenSource,
        onClick: () => {
          setActiveBlogTab(index);
          setOpenSourceData(item[1]);
          setOpenSourceContent({ key: i, data: item[1] });
          setActiveOpenSource(opensource[item[0]].label);
        },
      };
    });

  const previousTabContent = (previousTabIndex) => {
    const { allBlogs, openSourceBlogs, greenlakeBlogs, othersBlogs } = data;
    switch (previousTabIndex) {
      case 0:
        return allBlogs;
      case 1:
        return greenlakeBlogs;
      case 2:
        return openSourceBlogs;
      case 3:
        return othersBlogs;
      default:
        return allBlogs;
    }
  };

  /* eslint-disable no-param-reassign */
  const totalAllPlatformsBlogsCount = Object.entries(platforms).reduce(
    (accum, item) => {
      accum += item[1].count;
      return accum;
    },
    0,
  );
  /* eslint-disable no-param-reassign */

  return (
    <Tabs activeIndex={index} onActive={onActive} justify="start" pad="20px">
      <Tab title={`All (${totalAllBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.allBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
      <Tab title={`HPE GreenLake (${totalGreenLakeBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.greenlakeBlogs}
          columns={columns}
          activeTab={index}
          platform
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
      <Grommet theme={customTheme}>
        <Tab
          pad="none"
          title={
            <Menu
              /* eslint-disable-next-line no-unneeded-ternary */
              open={activeOpenSource ? true : false}
              dropProps={{
                align: { top: 'bottom', left: 'left' },
              }}
              items={openSourceMenuItems}
            >
              <Box
                width="220px"
                height={size === 'small' ? '36px' : '48px'}
                justify="center"
                align="center"
                direction="row"
              >
                <Text color="black" margin={{ right: 'xsmall' }}>
                  Open Source ({totalOpenSourceBlogsCount})
                </Text>
                <FormDown />
              </Box>
            </Menu>
          }
        >
          <BlogTabContent
            key={openSourceContent.key}
            initialPage={
              platform
                ? openSourceContent.data
                : previousTabContent(previousTab)
            }
            columns={columns}
            activeTab={index}
            platform
            setPlatform={setPlatform}
            setPreviousTab={setPreviousTab}
          />
        </Tab>
      </Grommet>
      <Grommet theme={customTheme}>
        <Tab
          pad="none"
          title={
            <Menu
              /* eslint-disable-next-line no-unneeded-ternary */
              open={activePlatform ? true : false}
              dropProps={{
                align: { top: 'bottom', left: 'left' },
              }}
              items={platformsMenuItems}
            >
              <Box
                width="220px"
                height={size === 'small' ? '36px' : '48px'}
                justify="center"
                align="center"
                direction="row"
              >
                <Text color="black" margin={{ right: 'xsmall' }}>
                  Products ({totalAllPlatformsBlogsCount})
                </Text>
                <FormDown />
              </Box>
            </Menu>
          }
        >
          <BlogTabContent
            key={platformContent.key}
            initialPage={
              platform ? platformContent.data : previousTabContent(previousTab)
            }
            columns={columns}
            activeTab={index}
            platform
            setPlatform={setPlatform}
            setPreviousTab={setPreviousTab}
          />
        </Tab>
      </Grommet>

      {/* <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.openSourceBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab> */}
      <Tab title={`Others (${totalOthersBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.othersBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
    </Tabs>
  );
}

const blogsPropType = PropTypes.shape({
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        date: PropTypes.string,
        description: PropTypes.string,
        authorimage: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  nextPage: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  collection: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}).isRequired;

BlogTabs.propTypes = {
  data: PropTypes.shape({
    featuredblogs: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string,
              description: PropTypes.string,
              authorimage: PropTypes.string,
              thumbnailimage: PropTypes.string,
              category: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    allBlogs: blogsPropType,
    openSourceBlogs: blogsPropType,
    greenlakeBlogs: blogsPropType,
    othersBlogs: blogsPropType,
    allBlogsCount: PropTypes.objectOf(PropTypes.number),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.number),
    ezmeralBlogsCount: PropTypes.objectOf(PropTypes.number),
    spiffeBlogsCount: PropTypes.objectOf(PropTypes.number),
    kubeDirectorBlogsCount: PropTypes.objectOf(PropTypes.number),
    dataFabricBlogsCount: PropTypes.objectOf(PropTypes.number),
    greenlakeBlogsCount: PropTypes.objectOf(PropTypes.number),
    chapelBlogsCount: PropTypes.objectOf(PropTypes.number),
    grommetBlogsCount: PropTypes.objectOf(PropTypes.number),
    projectdataMapBlogsCount: PropTypes.objectOf(PropTypes.number),
    zertoBlogsCount: PropTypes.objectOf(PropTypes.number),
    alletraBlogsCount: PropTypes.objectOf(PropTypes.number),
    deepLearningBlogsCount: PropTypes.objectOf(PropTypes.number),
    threeParBlogsCount: PropTypes.objectOf(PropTypes.number),
    nimbleBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewDashboardBlogsCount: PropTypes.objectOf(PropTypes.number),
    iloBlogsCount: PropTypes.objectOf(PropTypes.number),
    determinedBlogsCount: PropTypes.objectOf(PropTypes.number),
    smartSimBlogsCount: PropTypes.objectOf(PropTypes.number),
    dsccBlogsCount: PropTypes.objectOf(PropTypes.number),
    crayBlogsCount: PropTypes.objectOf(PropTypes.number),
    swarmBlogsCount: PropTypes.objectOf(PropTypes.number),
    hpeNonstopBlogsCount: PropTypes.objectOf(PropTypes.number),
    othersBlogsCount: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
  columns: PropTypes.shape({
    small: PropTypes.string,
    medium: PropTypes.arrayOf(PropTypes.string),
    large: PropTypes.arrayOf(PropTypes.string),
    xlarge: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default BlogTabs;
