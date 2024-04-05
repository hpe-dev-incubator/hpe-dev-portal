import React, { forwardRef, Fragment } from 'react';
import Markdown from 'markdown-to-jsx';
import {
  Heading,
  Paragraph,
  Anchor,
  Image,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from 'grommet';

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

const GrommetMarkdown = forwardRef(
  ({ children, components, options, theme, ...rest }, ref) => {
    const heading = [1, 2, 3, 4].reduce((obj, level) => {
      const result = { ...obj };
      result[`h${level}`] = {
        component: Heading,
        props: { level },
      };
      return result;
    }, {});

    const overrides = deepMerge(
      {
        a: { component: Anchor },
        img: { component: Image },
        p: { component: Paragraph },
        table: { component: Table },
        td: { component: TableCell, props: { plain: true } },
        tbody: { component: TableBody },
        tfoot: { component: TableFooter },
        th: { component: TableCell },
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

export { GrommetMarkdown };
