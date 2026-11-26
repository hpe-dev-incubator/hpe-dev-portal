import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link as GatsbyLink } from 'gatsby';
import { LinkNext } from 'grommet-icons';
import { FONT } from '../BlogListCard';

const SIDE_PADDING = 'max(24px, 8.33%, calc((100% - 1600px) / 2))';

const Section = styled.section`
  background: #f7f7f7;
  padding: 64px ${SIDE_PADDING} 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 40px 24px 64px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 48px;
  line-height: 56px;
  color: #3e4550;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  font-family: ${FONT};
  font-size: 20px;
  line-height: 28px;
  color: #3e4550;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Card = styled(GatsbyLink)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: inherit;
  text-decoration: none;

  &:hover h3,
  &:focus-visible h3 {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #01a982;
    outline-offset: 2px;
  }
`;

const CardImage = styled.div`
  height: 290px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CardBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  h3 {
    margin: 0;
    font-family: ${FONT};
    font-weight: 500;
    font-size: 24px;
    color: #3e4550;
  }
`;

const FindOutMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 16px;
  color: #006750;
`;

// Simple image + city + "Find out more" grid for an event series landing
// page already scoped to a single category, so (unlike the main Events
// page) no category filters are needed here. Cards link to this portal's
// own /event/<slug> page (sourced from content/event via the CMS), not out
// to the series' external Bizzabo registration site.
const DeveloperDaysPastEvents = ({ title, subtitle, events }) => {
  if (!events || events.length === 0) return null;

  return (
    <Section aria-labelledby="past-developer-days-title">
      <div>
        <Title id="past-developer-days-title">{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
      <Grid>
        {events.map(({ node }) => (
          <Card key={node.id} to={`/event${node.fields.slug}`}>
            <CardImage>
              <img src={node.frontmatter.image} alt="" />
            </CardImage>
            <CardBody>
              <h3>{node.frontmatter.title}</h3>
              <FindOutMore>
                Find out more
                <LinkNext size="small" color="#006750" />
              </FindOutMore>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

DeveloperDaysPastEvents.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fields: PropTypes.shape({
          slug: PropTypes.string.isRequired,
        }).isRequired,
        frontmatter: PropTypes.shape({
          title: PropTypes.string.isRequired,
          image: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }),
  ),
};

DeveloperDaysPastEvents.defaultProps = {
  subtitle: null,
  events: [],
};

export default DeveloperDaysPastEvents;
