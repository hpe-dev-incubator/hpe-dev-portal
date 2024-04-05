import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Button, Paragraph } from 'grommet';
import {
  OpenSourceCard,
  Layout,
  SEO,
  PageDescription,
  ResponsiveGrid,
  SectionHeader,
} from '../../components';
import { useSiteMetadata } from '../../hooks/use-site-metadata';

const columns = {
  small: ['auto'],
  medium: ['auto', 'auto'],
  large: ['auto', 'auto', 'auto'],
  xlarge: ['auto', 'auto', 'auto'],
};

const rows = {
  small: ['auto', 'auto', 'auto'],
  medium: ['auto', 'auto'],
  large: ['auto'],
  xlarge: ['auto'],
};

function Opensource({ data }) {
  const projects = data.allMarkdownRemark.edges;
  const siteMetadata = useSiteMetadata();
  const siteTitle = siteMetadata.title;
  // Create box for each platform
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
      <SEO title="Open Source" />
      {/* <Box flex overflow="auto" gap="large" pad="xlarge" wrap> */}
      <PageDescription
        image="/img/opensource/opensource.svg"
        title="Open Source"
        alignSelf="start"
        alt="opensource logo"
      >
        <Box gap="small">
          <Paragraph size="large">
            Dedicated to innovation through collaboration, HPE is proud to lead
            and contribute to many open source projects. Learn more about these
            projects here.
          </Paragraph>
          <Button
            primary
            href="https://www.hpe.com/us/en/open-source.html"
            target="_blank"
            rel="noreferrer noopener"
            alignSelf="start"
            label="Visit HPE Open Source"
          />
        </Box>
      </PageDescription>
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
      <SectionHeader color="green">
        <ResponsiveGrid gap="large" rows={rows} columns={columns}>
          {projects.map(({ node }) => (
            <OpenSourceCard
              key={node.id}
              title={node.frontmatter.title}
              description={node.frontmatter.description}
              link={node.frontmatter.link}
              image={node.frontmatter.image}
              category={node.frontmatter.category}
            />
          ))}
        </ResponsiveGrid>
      </SectionHeader>
      {/* </Box> */}
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
      filter: {
        fields: { sourceInstanceName: { eq: "opensource" } }
        frontmatter: { active: { eq: true } }
      }
      sort: {frontmatter: {priority: ASC}}
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
