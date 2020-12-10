import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading, Text, Image, Button } from 'grommet';
import { PlatformCard, Layout, SEO } from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
// Heading.propTypes = {
//   children: PropTypes.node.isRequired,
// };
function Opensource({ data }) {
  const projects = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  // const [index, setIndex] = useState(0);
  // let [categoryMap, setCategoryMap] = useState(new Map());
  // const onActive = nextIndex => setIndex(nextIndex);
  // const categoryArray = [];

  // useEffect(() => {
  //   projects.forEach(({ node }) => {
  //     categoryArray.push(node.frontmatter.category);
  //   });
  //   // Reduce function returns a single value operating with an array
  //   categoryMap = categoryArray.reduce(
  //     (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
  //     new Map(),
  //   );
  //   // categoryMap1.forEach((value, key) => {
  //   //   // categoryMap.set(key, value);
  //   //   setCategoryMap(prev => new Map([...prev, [key, value]]));
  //   //   // setCategoryMap(prev => new Map(prev).set(key, value));
  //   // });
  //   setCategoryMap(categoryMap);
  //   // const obj = Object.fromEntries(categoryMap);
  //   // const iterator1 = categoryMap.entries();
  //   // console.log('iterator', iterator1.next().value);

  //   // categoryMap.forEach((value, key) => console.log(key + ' = ' + value));

  //   // Object.entries(Object.fromEntries(categoryMap)).forEach(entry =>
  //   //   console.log('key', entry[0]),
  //   // );
  //   // categoryMap.forEach((value, key) => {
  //   //   console.log('myelement', key, value);
  //   // });
  // }, []);
  return (
    <Layout title={siteTitle}>
      <SEO title="Open SOurce" />
      <Box
        flex
        overflow="auto"
        gap="medium"
        pad="large"
        direction="column"
        wrap
      >
        <Box direction="row-responsive" align="start" gap="medium">
          <Box>
            <Image fit="contain" src="/img/opensource/opensource.svg" />
          </Box>
          <Box
            align="start"
            direction="column"
            pad={{ left: 'small', top: 'none' }}
            gap="small"
          >
            <Heading margin="none">Open Source</Heading>
            <Text color="strong">
              We are dedicated to open source innovation through collaboration
              and we are proud to be part of the open source community.
            </Text>
            <Text color="strong">
              As the infrastructure of the future moves to open source, HPE
              Developers help lead that charge.
            </Text>
            <Button
              primary
              href="https://www.hpe.com/us/en/software/spiffe-spire-open-source.html"
              target="_blank"
              rel="noreferrer noopener"
              alignSelf="start"
              label="Visit HPE Open Source"
              // label={
              //   <Box pad="xsmall">
              //     <Text color="text-strong"> Visit HPE Open Source</Text>
              //   </Box>
              // }
            >
              {' '}
            </Button>
          </Box>
        </Box>
        {/* <Box gap="medium" pad="medium">
          <Tabs
            // height="medium"
            // flex="grow"
            alignSelf="center"
            activeIndex={index}
            onActive={onActive}
          >
            {categoryMap.forEach((value, key) => (
              <Tab title={key}>
                <Box margin="small" pad="small">
                  <Text>{value}</Text>
                </Box>
              </Tab>
            ))}
          </Tabs>
        </Box> */}
        <Box
          flex={false}
          direction="row"
          wrap
          pad={{ top: 'medium' }}
          border={{
            side: 'top',
            color: 'green',
            size: 'small',
          }}
        >
          {projects.map(({ node }) => (
            <PlatformCard
              key={node.id}
              width={node.frontmatter.width}
              align={node.frontmatter.align}
              content={node.frontmatter.description}
              link={`/${node.fields.sourceInstanceName}${node.fields.slug}`}
              image={node.frontmatter.image}
              title={node.frontmatter.title}
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
Opensource.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              category: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              image: PropTypes.string,
              priority: PropTypes.number,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              // slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
export default Opensource;
export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { sourceInstanceName: { eq: "opensource" } } }
      sort: { fields: [frontmatter___title] }
    ) {
      edges {
        node {
          id
          rawMarkdownBody
          fields {
            slug
            sourceInstanceName
          }
          excerpt
          frontmatter {
            title
            category
            description
            link
            image
            priority
          }
        }
      }
    }
  }
`;
