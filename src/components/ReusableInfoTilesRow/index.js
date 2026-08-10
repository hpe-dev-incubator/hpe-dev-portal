import React from 'react';
import { navigate } from 'gatsby';
import { Box, Button, Grid, ResponsiveContext, Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import PropTypes from 'prop-types';

const tileThemes = {
  dark: {
    background: '#2F3444',
    titleColor: '#FFFFFF',
    bodyColor: '#DDE1E7',
    actionColor: '#00E5A0',
  },
  light: {
    background: '#F7F7F7',
    titleColor: '#292D3A',
    bodyColor: '#3E4550',
    actionColor: '#006750',
  },
};

const resolveAction = (item) => {
  if (!item.actionHref) {
    return null;
  }

  if (item.actionHref.match(/^\//)) {
    return () => navigate(item.actionHref);
  }

  return () => window.open(item.actionHref, '_blank', 'noopener,noreferrer');
};

const buildDesktopRows = (items, pattern) => {
  const rows = [];
  let cursor = 0;

  pattern.forEach((count) => {
    if (cursor < items.length) {
      rows.push(items.slice(cursor, cursor + count));
      cursor += count;
    }
  });

  if (cursor < items.length) {
    rows.push(items.slice(cursor));
  }

  return rows;
};

const buildAutoDesktopPattern = (itemCount, minPerRow = 2, maxPerRow = 4) => {
  if (itemCount <= maxPerRow) {
    return [itemCount];
  }

  const rowCount = Math.ceil(itemCount / maxPerRow);
  const baseCount = Math.floor(itemCount / rowCount);
  const remainder = itemCount % rowCount;

  if (baseCount < minPerRow) {
    return [itemCount];
  }

  return new Array(rowCount).fill(baseCount).map((count, index) => (
    index >= rowCount - remainder ? count + 1 : count
  ));
};

const getTilePadding = (isSpaciousDesktopRow) => ({
  horizontal: isSpaciousDesktopRow ? '40px' : '32px',
  vertical: isSpaciousDesktopRow ? '40px' : '32px',
});

const getTitleStyle = (theme) => ({
  fontFamily: "'HPE Graphik', 'Metric', Arial, sans-serif",
  fontWeight: 500,
  fontSize: '28px',
  lineHeight: '34px',
  letterSpacing: '-0.28px',
  color: theme.titleColor,
});

const getBodyStyle = (theme) => ({
  fontFamily: "'HPE Graphik', 'Metric', Arial, sans-serif",
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '0',
  verticalAlign: 'middle',
  color: theme.bodyColor,
  wordBreak: 'break-word',
});

const getActionTextStyle = (theme) => ({
  fontFamily: "'HPE Graphik', 'Metric', Arial, sans-serif",
  fontWeight: 500,
  fontSize: '24px',
  lineHeight: '34px',
  letterSpacing: '0',
  color: theme.actionColor,
});

const TileCard = ({ item, theme, onAction, isSpaciousDesktopRow, tileKey }) => (
  <Box
    key={tileKey}
    background={theme.background}
    pad={getTilePadding(isSpaciousDesktopRow)}
    gap="24px"
    style={{
      minWidth: 0,
      minHeight: isSpaciousDesktopRow ? '340px' : undefined,
      height: '100%',
    }}
  >
    <Box gap="12px">
      <Text style={getTitleStyle(theme)}>{item.title}</Text>
      <Text style={getBodyStyle(theme)}>{item.description}</Text>
    </Box>

    {item.actionLabel && (
      <Box align="start">
        <Button
          plain
          onClick={onAction || undefined}
          label={
            <Box direction="row" gap="small" align="center">
              <Text style={getActionTextStyle(theme)}>{item.actionLabel}</Text>
              <LinkNext color={theme.actionColor} size="24px" />
            </Box>
          }
        />
      </Box>
    )}
  </Box>
);

TileCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    background: PropTypes.string.isRequired,
    titleColor: PropTypes.string.isRequired,
    bodyColor: PropTypes.string.isRequired,
    actionColor: PropTypes.string.isRequired,
  }).isRequired,
  onAction: PropTypes.func,
  isSpaciousDesktopRow: PropTypes.bool,
  tileKey: PropTypes.string.isRequired,
};

TileCard.defaultProps = {
  onAction: null,
  isSpaciousDesktopRow: false,
};

const ReusableInfoTilesRow = ({ items, margin, maxWidth, containerPad }) => {
  return (
    <ResponsiveContext.Consumer>
      {(size) => {
        const isSmall = size === 'small';
        const isMedium = size === 'medium';
        const desktopRows = buildDesktopRows(items, buildAutoDesktopPattern(items.length));
        const horizontalPad = isSmall ? containerPad.small.horizontal : containerPad.medium.horizontal;
        const verticalPad = isSmall ? containerPad.small.vertical : containerPad.medium.vertical;
        const cardGap = isSmall ? '20px' : '32px';
        const rowGap = isSmall ? '20px' : '32px';

        return (
          <Box
            margin={margin}
            fill="horizontal"
            align="center"
            overflow="hidden"
            style={{ width: '100%', boxSizing: 'border-box' }}
            pad={{ horizontal: 'xlarge', vertical: 'large' }}
          >
            <Box
              width="100%"
              style={{ maxWidth, boxSizing: 'border-box' }}
              pad={{
                horizontal: horizontalPad,
                vertical: verticalPad,
              }}
            >
              {isSmall || isMedium ? (
                <Grid
                  fill="horizontal"
                  columns={isSmall ? ['auto'] : ['flex', 'flex']}
                  gap={cardGap}
                >
                  {items.map((item, index) => {
                    const theme = tileThemes[item.variant] || tileThemes.light;
                    const onAction = resolveAction(item);

                    return (
                      <TileCard
                        tileKey={`${item.title}-${index}`}
                        item={item}
                        theme={theme}
                        onAction={onAction}
                      />
                    );
                  })}
                </Grid>
              ) : (
                <Box gap={rowGap} fill="horizontal">
                  {desktopRows.map((rowItems, rowIndex) => (
                    <Grid
                      key={`row-${rowIndex}`}
                      fill="horizontal"
                      columns={new Array(rowItems.length).fill('flex')}
                      gap={cardGap}
                    >
                      {rowItems.map((item, index) => {
                        const theme = tileThemes[item.variant] || tileThemes.light;
                        const onAction = resolveAction(item);
                        const isSpaciousDesktopRow = rowItems.length <= 3;

                        return (
                          <TileCard
                            tileKey={`${item.title}-${rowIndex}-${index}`}
                            item={item}
                            theme={theme}
                            onAction={onAction}
                            isSpaciousDesktopRow={isSpaciousDesktopRow}
                          />
                        );
                      })}
                    </Grid>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        );
      }}
    </ResponsiveContext.Consumer>
  );
};

ReusableInfoTilesRow.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      actionLabel: PropTypes.string,
      actionHref: PropTypes.string,
      variant: PropTypes.oneOf(['dark', 'light']),
    }),
  ).isRequired,
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxWidth: PropTypes.string,
  containerPad: PropTypes.shape({
    small: PropTypes.shape({
      horizontal: PropTypes.string,
      vertical: PropTypes.string,
    }),
    medium: PropTypes.shape({
      horizontal: PropTypes.string,
      vertical: PropTypes.string,
    }),
  }),
};

ReusableInfoTilesRow.defaultProps = {
  margin: { horizontal: 'none', top: 'small', bottom: 'medium' },
  maxWidth: '1600px',
  containerPad: {
    small: { horizontal: '20px', vertical: '20px' },
    medium: { horizontal: '0px', vertical: '24px' },
  },
};

export default ReusableInfoTilesRow;
