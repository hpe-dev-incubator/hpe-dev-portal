import styled from 'styled-components';
import { Table, TableCell } from 'grommet';

// Zebra-striped table styling for hero-banner pages (campaign, osscontribute),
// scoped locally via Markdown overrides so it does not affect default table styling.
export const AgendaMarkdownTable = styled(Table)`
  width: 100%;
  margin: 0;
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;

  thead tr {
    background: #f7f7f7;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody tr:nth-child(even) {
    background: #f7f7f7;
  }
`;

export const AgendaTableCell = styled(TableCell)`
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

  a {
    text-decoration: underline;
  }
`;

export const AgendaTableHeaderCell = styled(TableCell)`
  padding: 32px 24px;
  border: 0;
  color: #3e4550;
  font-size: 28px;
  font-weight: 500;
  line-height: 34px;
  letter-spacing: -0.28px;
  text-align: left;
  vertical-align: middle;
  word-break: break-word;
`;

export const agendaTableOverrides = {
  table: { component: AgendaMarkdownTable },
  td: { component: AgendaTableCell, props: { plain: true } },
  th: { component: AgendaTableHeaderCell, props: { plain: true } },
};
