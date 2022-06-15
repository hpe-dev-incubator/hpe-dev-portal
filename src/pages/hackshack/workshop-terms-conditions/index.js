/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Text, Anchor } from 'grommet';
import { Previous } from 'grommet-icons';
import { Link } from 'gatsby';
import GrommetThemeWrapper from '../../../components/hackshack/Grommet/GrommetThemeWrapper';
import { Layout } from '../../../components/hackshack';
import { SEO } from '../../../components';

const TableColumns = ({ Row1, Row2 }) => {
  return (
    <Box fill="horizontal" direction="row">
      <Box pad="small" basis="1/2" border>
        <Text size="xlarge">{Row1}</Text>
      </Box>
      <Box pad="small" basis="1/2" border>
        <Text size="xlarge">{Row2}</Text>
      </Box>
    </Box>
  );
};

TableColumns.propTypes = {
  Row1: PropTypes.string,
  Row2: PropTypes.string,
};

const WorkshopTC = () => {
  return (
    <GrommetThemeWrapper>
      <Layout background="/img/hackshack/BackgroundImages/generic-background.svg">
        <SEO title="Hack Shack Workshop Terms" />
        <Box align="start" width="xlarge" direction="column">
          <Box align="start">
            <Link to="/hackshack/workshops">
              <Button
                color="white"
                icon={<Previous size="small" />}
                label="Back to Hack Shack Workshop"
              />
            </Link>
            <Heading
              color="text-strong"
              level="1"
              margin={{ bottom: 'large', top: 'none' }}
            >
              Terms of Use for HPE Hack Shack Workshops-on-Demand
            </Heading>
          </Box>
          <Text size="xlarge">
            Hewlett Packard Enterprise Company (“HPE”) invites you to
            participate in the HPE Hack Shack Workshops-on-Demand (“Workshops”)
            in accordance with these terms and conditions (“Terms and
            Conditions”).  
          </Text>
          <br />
          <Text size="xlarge">
            HPE reserves the right to deny and/or revoke participation in and
            credentials to the Workshops for any participant at any time for any
            reason whatsoever at its sole discretion. Without limiting the
            foregoing, HPE reserves the right, in its sole discretion, to deny
            or otherwise restrict participation in any Workshops of any
            individual it finds to be tampering with the operation of the
            Workshops or any website related to the Workshops; to be acting in
            violation of these Terms and Conditions; or to be acting in a
            disruptive manner, or with intent to annoy, abuse, threaten, or
            harass any person participating in or connected with the Workshops.
            HPE is not responsible for any loss of data resulting from your
            participation in the Workshops or any data saved or left on the
            Workshops. All third party trademarks are the property of their
            respective owners.
          </Text>
          <br />
          <Text size="xlarge">
            The Workshops are provided “as is,” and HPE makes no warranty that
            the Workshops will meet your requirements or be uninterrupted,
            timely, secure, or error free. HPE makes no warranty as to the
            results that may be obtained from the use of the Workshops or as to
            the accuracy or reliability of any information obtained through the
            Workshops. HPE EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND
            (EXPRESS, IMPLIED, OR STATUTORY) WITH RESPECT TO THE WORKSHOPS,
            WHICH INCLUDES BUT IS NOT LIMITED TO, ANY IMPLIED OR STATUTORY
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR USE OR
            PURPOSE, TITLE, AND NON-INFRINGEMENT OF INTELLECTUAL PROPERTY
            RIGHTS.
          </Text>
          <br />
          <Text size="xlarge">
            By participating in the Workshops, to the maximum extent permitted
            by applicable laws, you release and discharge HPE from any and all
            liability resulting from late, lost, delayed, stolen, misdirected,
            unreadable, incorrect, inaccurate, garbled, unintelligible or
            postage due data and/or communications, including without
            limitation, Workshops content and information, regardless of the
            method of transmission. By participating in the Workshops, you agree
            that HPE shall not be liable for, and, to the maximum extent
            permitted by applicable laws, you shall release and hold HPE, its
            affiliates, subsidiaries, licensees, officers, directors, agents,
            representatives and employees (collectively, “Released Parties”),
            harmless from, any and all losses, injuries, claims, and/or causes
            of action arising out of participation in the Workshops and the
            content created by you in any Workshops. You waive the right to
            claim any attorneys’ fees and any damages whatsoever, including, but
            not limited to, punitive, consequential, direct, or indirect
            damages. You also agree that the Released Parties are not
            responsible or liable for any injury or damage to your or third
            person's computer and/or its contents, related to or resulting from
            any part of the Workshops.
          </Text>
          <br />
          <Text size="xlarge">
            By participating in the Workshops and providing HPE with your
            personal data, you consent to the use of your data by HPE for
            purposes of conducting the Workshops in accordance with these Terms
            and Conditions and subject to HPE’s Privacy Statement, available at{' '}
            <Anchor
              href="https://www.hpe.com/us/en/legal/privacy.html"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://www.hpe.com/us/en/legal/privacy.html
            </Anchor>
            .
          </Text>
          <br />
        </Box>
      </Layout>
    </GrommetThemeWrapper>
  );
};
export default WorkshopTC;
