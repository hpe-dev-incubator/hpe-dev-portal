import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';
import { LinkNext } from 'grommet-icons';
import CarouselNavButtons from '../CarouselNavButtons';
import {
  BlogAuthor,
  FONT,
  ReadMore,
  getBlogInfo,
  getBlogLink,
} from '../BlogListCard';

const SIDE_PADDING = 'max(24px, 8.33%, calc((100% - 1600px) / 2))';
const CARD_GAP = 40;
const FALLBACK_IMAGES = 10;

const Section = styled.section`
  background: #ffffff;
  padding: 80px 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 48px 0;
  }
`;

const Container = styled.div`
  padding: 0 ${SIDE_PADDING};
  display: flex;
  flex-direction: column;
  gap: 64px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${FONT};
  font-weight: 500;
  font-size: 36px;
  line-height: normal;
  letter-spacing: -0.5px;
  color: #292d3a;
`;

const cardLink = `
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid #01a982;
    outline-offset: 2px;
  }
`;

const HeroCard = styled(GatsbyLink)`
  ${cardLink}
  display: flex;
  gap: 40px;
  background: #f7f7f7;

  &:hover h3,
  &:focus-visible h3 {
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
  }
`;

const HeroImage = styled.div`
  flex: 0 0 637px;
  position: relative;
  min-height: 300px;
  background: #d5d5d5;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 900px) {
    flex-basis: auto;
    height: 220px;
    min-height: 0;
  }
`;

const HeroBody = styled.div`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  padding: 32px;

  h3 {
    margin: 0;
    font-family: ${FONT};
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -0.3px;
    color: #292d3a;
  }

  p {
    margin: 0;
    font-family: ${FONT};
    font-size: 18px;
    line-height: 27px;
    color: #67686e;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ${BlogAuthor} {
    font-weight: 500;
    gap: 12px;

    img {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 768px) {
    padding: 24px;

    h3 {
      font-size: 24px;
      line-height: 32px;
    }
  }
`;

// The carousel bleeds to the right edge of the viewport; the left padding
// keeps the first card aligned with the rest of the section.
const Scroller = styled.div`
  padding: 0 ${SIDE_PADDING};
  scroll-padding: 0 ${SIDE_PADDING};
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Track = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${CARD_GAP}px;
  width: max-content;
`;

const SlideCard = styled(GatsbyLink)`
  ${cardLink}
  flex: 0 0 436px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;

  &:hover h3,
  &:focus-visible h3 {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    flex-basis: 80vw;
  }
`;

const SlideImage = styled.div`
  height: 272px;
  background: #d5d5d5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const SlideBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;

  h3 {
    margin: 0;
    font-family: ${FONT};
    font-weight: 500;
    font-size: 28px;
    line-height: 34px;
    letter-spacing: -0.3px;
    color: #292d3a;
    overflow-wrap: anywhere;
  }

  ${BlogAuthor} {
    color: #67686e;
    margin-top: auto;
  }
`;

const findFirstImgInBody = (body) => {
  const match =
    /!\[[^\]]*\]\((?<filename>[^"\s)]+)/i.exec(body || '') ||
    /src\s*=\s*"(.+?)"/i.exec(body || '');
  return match ? match[1] : null;
};

// Featured posts rarely define a thumbnail, so fall back to the first image
// in the post, then to the shared developer stories artwork.
const getFeaturedImage = (node, index) =>
  node.frontmatter.thumbnailimage ||
  findFirstImgInBody(node.rawMarkdownBody) ||
  `/img/dev-stories/dev-story-${index % FALLBACK_IMAGES}.jpg`;

const linkProps = (node) => {
  const { href, external } = getBlogLink(node);
  return external
    ? { as: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: href };
};

const FeaturedBlogsSection = ({ blogs }) => {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener('resize', updateButtons);
    return () => window.removeEventListener('resize', updateButtons);
  }, [updateButtons, blogs]);

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    const card = el?.querySelector('a');
    if (!el || !card) return;
    el.scrollBy({
      left: direction * (card.offsetWidth + CARD_GAP),
      behavior: 'smooth',
    });
  };

  if (!blogs || blogs.length === 0) return null;

  const [{ node: lead }, ...rest] = blogs;
  const leadInfo = getBlogInfo(lead);

  return (
    <Section aria-labelledby="featured-blogs-title">
      <Container>
        <SectionTitle id="featured-blogs-title">Featured Blogs</SectionTitle>
        <HeroCard {...linkProps(lead)}>
          <HeroImage>
            <img src={getFeaturedImage(lead, 0)} alt="" />
          </HeroImage>
          <HeroBody>
            {leadInfo.author && (
              <BlogAuthor>
                {leadInfo.authorimage && <img src={leadInfo.authorimage} alt="" />}
                <span>{leadInfo.author}</span>
              </BlogAuthor>
            )}
            <h3>{leadInfo.title}</h3>
            <p>{lead.frontmatter.description || lead.excerpt}</p>
            <ReadMore>Read more</ReadMore>
          </HeroBody>
        </HeroCard>
      </Container>
      {rest.length > 0 && (
        <>
          <Scroller
            ref={scrollerRef}
            onScroll={updateButtons}
            style={{ marginTop: 64 }}
          >
            <Track>
              {rest.map(({ node }, i) => {
                const { title, author, authorimage } = getBlogInfo(node);
                return (
                  <SlideCard key={node.id} {...linkProps(node)}>
                    <SlideImage>
                      <img src={getFeaturedImage(node, i + 1)} alt="" />
                    </SlideImage>
                    <SlideBody>
                      <h3>{title}</h3>
                      {author && (
                        <BlogAuthor>
                          {authorimage && <img src={authorimage} alt="" />}
                          <span>{author}</span>
                        </BlogAuthor>
                      )}
                      <ReadMore>
                        Read more
                        <LinkNext size="small" color="#006750" />
                      </ReadMore>
                    </SlideBody>
                  </SlideCard>
                );
              })}
            </Track>
          </Scroller>
          {(canPrev || canNext) && (
            <Container>
              <CarouselNavButtons
                onPrev={() => scrollByCard(-1)}
                onNext={() => scrollByCard(1)}
                disablePrev={!canPrev}
                disableNext={!canNext}
                ariaLabelPrev="Previous featured blogs"
                ariaLabelNext="Next featured blogs"
                marginTop="40px"
              />
            </Container>
          )}
        </>
      )}
    </Section>
  );
};

FeaturedBlogsSection.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        excerpt: PropTypes.string,
        rawMarkdownBody: PropTypes.string,
        frontmatter: PropTypes.shape({
          title: PropTypes.string,
          author: PropTypes.string,
          authorimage: PropTypes.string,
          description: PropTypes.string,
          thumbnailimage: PropTypes.string,
          externalLink: PropTypes.string,
        }).isRequired,
        fields: PropTypes.shape({
          slug: PropTypes.string,
          sourceInstanceName: PropTypes.string,
        }),
      }).isRequired,
    }),
  ),
};

export default FeaturedBlogsSection;
