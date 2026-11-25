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

const Eyebrow = styled.p`
  margin: 0;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 16px;
  color: #006750;
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${FONT};
  font-weight: 300;
  font-size: 52px;
  line-height: 58px;
  letter-spacing: -1.04px;
  color: #3e4550;
`;

const Content = styled.div`
  display: flex;
  gap: 64px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const Copy = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: ${FONT};
  font-size: 20px;
  line-height: normal;
  color: #3e4550;

  p {
    margin: 0;
  }

  p:last-child {
    font-weight: 500;
  }
`;

const Takeaways = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  h3 {
    margin: 0;
    font-family: ${FONT};
    font-weight: 500;
    font-size: 28px;
    color: #3e4550;
  }

  > p {
    margin: 0;
    font-family: ${FONT};
    font-size: 18px;
    color: #3e4550;
  }
`;

const TakeawayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 32px;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Takeaway = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  span {
    font-family: ${FONT};
    font-size: 18px;
    color: #3e4550;
  }
`;

const Bullet = styled.span`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #006750;
`;

// Intro section reused across event series landing pages: an eyebrow +
// heading, body copy on the left, and a bulleted "takeaways" list on the
// right.
const WorkshopOverviewSection = ({
  eyebrow,
  title,
  paragraphs,
  takeawaysTitle,
  takeawaysIntro,
  takeaways,
}) => (
  <Section>
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Title>{title}</Title>
    </div>
    <Content>
      <Copy>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Copy>
      <Takeaways>
        <h3>{takeawaysTitle}</h3>
        {takeawaysIntro && <p>{takeawaysIntro}</p>}
        <TakeawayGrid>
          {takeaways.map((takeaway) => (
            <Takeaway key={takeaway}>
              <Bullet />
              <span>{takeaway}</span>
            </Takeaway>
          ))}
        </TakeawayGrid>
      </Takeaways>
    </Content>
  </Section>
);

WorkshopOverviewSection.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
  takeawaysTitle: PropTypes.string.isRequired,
  takeawaysIntro: PropTypes.string,
  takeaways: PropTypes.arrayOf(PropTypes.string).isRequired,
};

WorkshopOverviewSection.defaultProps = {
  eyebrow: null,
  takeawaysIntro: null,
};

export default WorkshopOverviewSection;
