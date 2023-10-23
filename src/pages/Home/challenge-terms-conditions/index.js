import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Heading, Text, Anchor, Grommet } from 'grommet';
import { hpe } from 'grommet-theme-hpe';
import { Previous } from 'grommet-icons';
import { Link } from 'gatsby';
import { SEO } from '../../../components';
import { Layout } from '../../../components/hackshack';

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

const ChallengeTC = () => {
  return (
    <Grommet theme={hpe}>
      <Layout background="/img/generic-background.svg">
        <SEO title="Hack Shack Challenge Terms" />
        <Box align="start" width="xlarge" direction="column">
          <Box align="start">
            <Link to="/hackshack/challenges">
              <Button
                color="white"
                icon={<Previous size="small" />}
                label="Back to Hack Shack Challenge"
              />
            </Link>
            <Heading
              color="text-strong"
              level="1"
              margin={{ bottom: 'none', top: 'none' }}
            >
              HPE Coding Challenge Giveaway
            </Heading>
            <Text color="text-strong" margin={{ bottom: 'large' }}>
              TERMS AND CONDITIONS
            </Text>
          </Box>
          <Text size="xlarge">
            1. <strong>SPONSOR:</strong> The sponsor of this giveaway is Hewlett
            Packard Enterprise Company (“HPE”), 6280 America Center Dr, San
            Jose, CA 95002.
          </Text>
          <br />
          <Text size="xlarge">
            2. <strong>INTRODUCTION:</strong> HPE invites KubeCon attendees who
            wish to complete the HPE Hack Shack coding challenge (“Challenge”)
            to participate in the HPE Coding Challenge Giveaway (“Program”) for
            a chance to win a fifty dollar (USD $50.00) e-gift card for HPE
            branded merchandise (“Prize”), subject to the terms and conditions
            below (“Terms and Conditions”). By participating in the Program,
            participants affirm that they have read, accepted, and agree to
            waive any right to claim any ambiguity or error in these Terms and
            Conditions or the entry itself and agree to be bound by these Terms
            and Conditions and HPE’s decisions, which are final and binding in
            all respects. HPE reserves the right to review, modify, extend or
            discontinue any and/or all aspects of the Program, including these
            Terms and Conditions, at any time without prior notice. The Program
            is subject to federal, state, and local laws and regulations and is
            void where prohibited.
          </Text>
          <br />
          <Text size="xlarge">
            3. <strong>PROGRAM PERIOD:</strong> The Program begins on November
            17, 2020 at 9 AM Pacific Time and ends at 11:59 PM Pacific Time on
            November 22, 2020, or when the Program budget has been reached,
            whichever is earlier (the “Program Period”). Entries submitted
            before or after the Program Period will not be eligible. HPE’s
            computer is the official time-keeping device for the Program.
          </Text>
          <br />
          <Text size="xlarge">
            4. <strong>ELIGIBILITY:</strong> NO HPE PRODUCT OR SERVICE PURCHASE
            NECESSARY. A PURCHASE WILL NOT IMPROVE YOUR CHANCES OF WINNING. The
            Program is open only to participants eighteen (18) years of age and
            older who are attendees of KubeCon. Void in Puerto Rico, U.S.
            territories and possessions, and where prohibited by law. Employees,
            contractors, and contingent workers of HPE, its subsidiaries,
            affiliates, their immediate family and household members are not
            eligible. Employees of the following entities are ineligible for
            this promotion: National/federal, state, and local government
            entities, public higher education institutions, and private or
            public K-12 educational institutions and libraries and their board
            members, employees, officers, representatives, agents, consultants
            and independent contractors. HPE shall determine Program eligibility
            in its sole and absolute discretion.
          </Text>
          <br />
          <Text size="xlarge">
            5. <strong>HOW TO ENTER:</strong> By completing the Challenge during
            the Program Period, participants may be considered eligible for the
            Prize. LIMIT ONE (1) PRIZE PER PERSON/ENTRY WHILE SUPPLIES LAST. The
            Prize (approximate retail value: $50.00) is subject to these Terms
            and Conditions. In order to enter the Program, participants must
            access the Challenge website via the link provided by HPE. At the
            Challenge website, participants must then select the Challenge card,
            click on the “Challenge me” button, and fill in and submit the
            registration form with their valid name, email address, and company
            name. Participants that submit the registration form will receive an
            email providing a link to the Challenge. Participants must then
            complete the Challenge and its accompanying quiz and submit their
            entry via email to{' '}
            <Anchor
              href="mailto:hpedev.hackshack@hpe.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              hpedev.hackshack@hpe.com
            </Anchor>{' '}
            during the Program Period. By participating in the Challenge, each
            participant (i) represents and warrants that he/she has the full
            power and authority to submit content to HPE and to grant any and
            all associated rights to the content listed herein; (ii) hereby
            assigns all right, title, and interest in and to the content
            submitted in their Challenge entry to HPE; (iii) acknowledges that
            the content submitted will belong to HPE and will be hosted on the
            HPE Developer Community, an open-source community, for the use of
            all its registered members; (iv) acknowledges that each participant
            is responsible for any malware, virus, or malicious code found in
            the content submitted by such participant; and (v) represents and
            warrants that, except for any open-source components contained
            therein, any content submitted will be the participant’s original
            work and will not violate the rights of any third party.
          </Text>
          <br />
          <Text size="xlarge">
            6. <strong>PRIZE:</strong> Interested parties who merely complete
            the Challenge or submit an entry are not guaranteed a Prize. The
            total estimated retail value of each Prize is USD $50.00. HPE will
            give away a total of three (3) Prizes, with a total estimated retail
            value of USD $150.00. No later than fourteen (14) business days
            after the end of the Program Period, three (3) potential winners
            will be selected from all eligible entries received during the
            Program Period. A panel of three (3) HPE judges will select the
            three (3) winners who they determine have submitted the best
            Challenge entries based on the following criteria: 50% Technical
            achievement and 50% Completeness. Odds of winning depend on the
            total number of eligible entries received during the Program Period.
            An email Prize notification will be sent to the potential winners
            within five (5) business days. Should you be awarded a Prize, you
            will be contacted via the email address used in your entry method.
            It shall be your responsibility to claim the Prize within fifteen
            (15) days of notification from HPE. Failure to do so will result in
            forfeiture of the Prize, and an alternate winner may be selected in
            a random drawing from among the remaining eligible entries.
          </Text>
          <br />
          <Text size="xlarge">
            No substitution, cash redemption or transfer of Prizes, except in
            HPE’s sole discretion. The Prize may not be used for resale or
            distribution. Taxes and duties, if any, are winner’s responsibility.
            Prizes are promotional in nature and may be subject to an expiration
            date. Each participant is limited to one (1) Prize only and any
            entries submitted after a participant has received a Prize will not
            be an eligible entry. Any Prize details not specified herein will be
            determined by HPE in its sole discretion. HPE reserves the right to
            not fulfill your Prize in the event that the Prize is not certified
            in your country. Due to abuse, we cannot provide Prizes to
            individuals who register with Yahoo, Gmail, Hotmail, and other email
            domains not registered to your company. Please speak directly to
            your HPE representative if you have any questions. KubeCon is not
            affiliated with HPE and is not a sponsor of this Program. All third
            party trademarks are the property of their respective owners.
          </Text>
          <br />
          <Text size="xlarge">
            7. <strong>DISQUALIFICATION:</strong> HPE reserves the right to
            disqualify any participant and any entries at any time or during any
            phase of the Program for any reason whatsoever at its sole
            discretion. Without limiting the foregoing, HPE reserves the right,
            in its sole discretion, to disqualify any individual it finds to be
            tampering with the operation of the Program or any website related
            to the Program; to be acting in violation of these Terms and
            Conditions; or to be acting in a disruptive manner, or with intent
            to annoy, abuse, threaten or harass any person participating in or
            connected with the Program. Any attempt by you to obtain more than
            the stated number of entries by using multiple or different
            identities, or any other prohibited methods will void your entry and
            you shall be disqualified. Use of any automated system to
            participate is prohibited and will result in disqualification. HPE’s
            server shall be the official time stamp for the purposes of
            determining the validity of any participation in the Program (where
            applicable).
          </Text>
          <br />
          <Text size="xlarge">
            8. <strong>RELEASE AND LIMITATIONS OF LIABILITY:</strong> By
            participating in this Program, to the maximum extent permitted by
            applicable laws, you release and discharge HPE from any and all
            liability resulting from late, lost, delayed, stolen, misdirected,
            unreadable, incorrect, inaccurate, garbled, unintelligible or
            postage due communications, including without limitation, entry and
            Program information, regardless of the method of transmission. By
            participating in the Program, you agree that HPE shall not be liable
            for, and, to the maximum extent permitted by applicable laws, you
            shall release and hold HPE, its affiliates, subsidiaries, licensees,
            officers, directors, agents, representatives and employees
            (collectively, “Released Parties”), harmless from, any and all
            losses, injuries, claims, and/or causes of action arising out of
            participation in the Program, the content of any entries, and/or
            receipt or use of any Prize. You waive the right to claim any
            attorneys’ fees and any damages whatsoever, including, but not
            limited to, punitive, consequential, direct, or indirect damages.
            You also agree that the Released Parties are not responsible or
            liable for any injury or damage to your or third person's computer
            and/or its contents, related to or resulting from any part of the
            Program.
          </Text>
          <br />
          <Text size="xlarge">
            9. <strong>PRIVACY:</strong> By participating in the Program and
            providing HPE with your personal data, you consent to the use of
            your data by HPE for purposes of conducting this Program in
            accordance with these Terms and Conditions and subject to HPE’s
            Privacy Statement, available at{' '}
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
          <Text size="xlarge">
            10. <strong>ENGLISH LANGUAGE:</strong> HPE and the Program
            participants confirm that it is their wish that the Terms and
            Conditions, as well as any other documents relating to the Terms and
            Conditions or the Program, including notices, schedules, exhibits
            and authorizations, have been and shall be drawn up in the English
            language only. HPE et les participants au programme confirment
            qu'ils souhaitent que les conditions générales, ainsi que tout autre
            document relatif aux conditions générales ou au programme, y compris
            les avis, les horaires, les expositions et les autorisations, aient
            été et soient rédigés en la langue anglaise uniquement.
          </Text>
          <br />
          <Text size="xlarge">
            11. <strong>GOVERNING LAW:</strong> The Terms and Conditions shall
            be governed by and construed under the laws of the State of
            California without regard to conflict of laws principles. Any
            dispute under the Terms and Conditions shall be subject to the
            non-exclusive jurisdiction of the courts of the State of California.
            You irrevocably waive any objection on the grounds of venue, forum
            non-conveniens or any similar grounds and irrevocably consent to
            service of process by mail or in any other manner permitted by
            applicable law and consent to the jurisdiction of the courts of the
            State of California. You further hereby waive any right to a trial
            by jury with respect to any lawsuit or judicial proceeding arising
            or relating to the Terms and Conditions.
          </Text>
        </Box>
      </Layout>
    </Grommet>
  );
};
export default ChallengeTC;
