import {
  Anchor,
  Heading,
  Image,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from 'grommet';
import Markdown from 'markdown-to-jsx';
import React, { forwardRef, Fragment } from 'react';
import styled from 'styled-components';

const isObject = (item) =>
  item && typeof item === 'object' && !Array.isArray(item);

const deepMerge = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }
  // making sure to not change target (immutable)
  const output = { ...target };
  sources.forEach((source) => {
    if (isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!output[key]) {
            output[key] = { ...source[key] };
          } else {
            output[key] = deepMerge(output[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
  });
  return output;
};

const headingStyles = {
  1: {
    fontSize: 'clamp(40px, 5vw, 68px)',
    fontWeight: 500,
    lineHeight: 'clamp(46px, 5.5vw, 74px)',
    letterSpacing: 'clamp(-0.8px, -0.04em, -2.72px)',
  },
  2: {
    fontSize: 'clamp(32px, 3.5vw, 52px)',
    fontWeight: 500,
    lineHeight: 'clamp(38px, 4vw, 58px)',
    letterSpacing: 'clamp(-0.32px, -0.03vw, -1.04px)',
  },
  3: {
    fontSize: 'clamp(26px, 3.1vw, 36px)',
    fontWeight: 500,
    letterSpacing: 'clamp(0px, -0.02vw, -0.36px)',
    lineHeight: 'clamp(32px, 3.6vw, 42px)',
  },
  4: {
    fontSize: '28px',
    fontWeight: 500,
    letterSpacing: '-0.28px',
    lineHeight: '33.992px',
  },
};

const StyledMarkdownTable = styled(Table)`
  width: 100%;
  margin: 32px 0;
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  background: #ffffff;

  thead tr {
    border-bottom: 4px solid #b1b9be;
  }

  tbody tr {
    border-top: 1px solid #d4d8db;
    border-bottom: 1px solid #d4d8db;
  }
`;

const StyledMarkdownTableCell = styled(TableCell)`
  padding: 32px 24px;
  border: 0;
  color: #3e4550;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: -0.2px;
  text-align: left;
  vertical-align: middle;
  word-break: break-word;
`;

const StyledMarkdownTableHeaderCell = styled(TableCell)`
  padding: 32px 24px;
  border: 0;
  color: #292d3a;
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0;
  text-align: center;
  vertical-align: middle;
  word-break: break-word;
`;

const GrommetMarkdown = forwardRef(
  ({ children, components, options, theme, ...rest }, ref) => {
    const heading = [1, 2, 3, 4].reduce((obj, level) => {
      const result = { ...obj };
      result[`h${level}`] = {
        component: Heading,
        props: {
          level,
          ...(headingStyles[level] ? { style: headingStyles[level] } : {}),
        },
      };
      return result;
    }, {});

    const overrides = deepMerge(
      {
        a: { component: Anchor },
        img: { component: Image },
        p: { component: Paragraph },
        table: { component: StyledMarkdownTable },
        td: { component: StyledMarkdownTableCell, props: { plain: true } },
        tbody: { component: TableBody },
        tfoot: { component: TableFooter },
        th: {
          component: StyledMarkdownTableHeaderCell,
          props: { plain: true },
        },
        thead: { component: TableHeader },
        tr: { component: TableRow },
      },
      heading,
      components,
      options && options.overrides,
    );

    // we use Fragment as the wrapper so we can assign the ref with the div
    // wrapper can still be overridden with the options.
    return (
      <div ref={ref} {...rest}>
        <Markdown
          {...{ children }}
          options={{ wrapper: Fragment, ...options, overrides }}
        />
      </div>
    );
  },
);

export { GrommetMarkdown, headingStyles };
