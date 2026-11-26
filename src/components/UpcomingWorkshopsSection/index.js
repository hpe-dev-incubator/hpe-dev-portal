import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FONT } from '../BlogListCard';

const SIDE_PADDING = 'max(24px, 8.33%, calc((100% - 1600px) / 2))';

const Section = styled.section`
  background: #ffffff;
  padding: 64px ${SIDE_PADDING};
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 40px 24px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 32px;

  & > * {
    flex: 1 1 320px;
  }
`;

const Card = styled.div`
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
`;

const CardImage = styled.div`
  height: 280px;

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
    font-size: 32px;
    color: #3e4550;
  }

  p {
    margin: 0;
    font-family: ${FONT};
    font-size: 18px;
    color: #3e4550;
  }
`;

const ComingSoon = styled.p`
  font-family: ${FONT};
  font-weight: 500;
  font-size: 16px;
  color: #006750;
`;

// Visually matches a disabled secondary pill button: cities announced
// without a confirmed registration page yet have nowhere to link to.
const DisabledButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  min-height: 56px;
  padding: 12px 24px;
  border: 3px solid #d4d8db;
  border-radius: 9999px;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.24);
`;

// Announced city stops that don't have a live registration page yet, shown
// as a non-interactive "Coming soon" card (matches the Figma design, which
// renders this CTA disabled rather than linking anywhere).
const UpcomingWorkshopsSection = ({ title, subtitle, workshops }) => {
  if (!workshops || workshops.length === 0) return null;

  return (
    <Section aria-labelledby="upcoming-workshops-title">
      <div>
        <Title id="upcoming-workshops-title">{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
      <Grid>
        {workshops.map((workshop) => (
          <Card key={workshop.city}>
            <CardImage>
              <img src={workshop.image} alt="" />
            </CardImage>
            <CardBody>
              <ComingSoon>Coming soon</ComingSoon>
              <h3>{workshop.city}</h3>
              <p>{workshop.description}</p>
              <DisabledButton aria-disabled="true">Coming soon</DisabledButton>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

UpcomingWorkshopsSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  workshops: PropTypes.arrayOf(
    PropTypes.shape({
      city: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ),
};

UpcomingWorkshopsSection.defaultProps = {
  subtitle: null,
  workshops: [],
};

export default UpcomingWorkshopsSection;
