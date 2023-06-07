import React from 'react';
import '../../css/style.css';
import Swal from 'sweetalert2';

const { GATSBY_SLACK_TOKEN } = process.env;
const { GATSBY_SLACK_INVITE_URL } = process.env;
export default function Slacksignup() {
  // eslint-disable-next-line consistent-return
  const onsubmit = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const email = form.email.value;
    if (email) {
      const doInvite = () => {
        // add as a formdata in key value pairs ;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('token', GATSBY_SLACK_TOKEN);
        formData.append('set_active', true);
        return fetch(GATSBY_SLACK_INVITE_URL, {
          method: 'POST',
          body: formData,
          json: true,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.ok) {
              const el = document.createElement('div');
              el.innerHTML = `Please check <b> ${email}</b> 
                              for an invite from slack`;
              Swal.fire({
                title: 'SUCCESS !',
                html: el,
                icon: 'success',
              });
            } else {
              let { error } = data;
              if (error === 'already_invited' || error === 'already_in_team') {
                const el = document.createElement('div');
                el.innerHTML =
                  "It seems like you are already member of our slack.<br>Visit <a href=https://hpedev.slack.com target='_blank' > <b> HPE Developer Community</b></a> on slack";
                Swal.fire({
                  title: 'Success',
                  html: el,
                  icon: 'success',
                });
              } else if (error === 'already_in_team_invited_user') {
                const l = document.createElement('div');
                l.innerHTML = `Please check again <b style="font-size:large;" > ${email} </b> for an invite from Slack.<br>Visit <a href=https://developer.hpe.com/ target="_blank"> HPE Developer Community</a>`;
                Swal.fire({
                  title: 'It seems like we already sent you our slack invite',
                  html: l,
                  icon: 'info',
                });
              } else {
                if (error === 'invalid_email') {
                  error = 'The email you entered is an invalid email.';
                } else if (error === 'invalid_auth') {
                  error =
                    'Something has gone wrong. Please' +
                    ' contact a system administrator.';
                }
                Swal.fire({
                  title: 'Error',
                  html: error,
                  icon: 'error',
                });
              }
            }
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error !',
              html: err,
              icon: 'error',
            });
          });
      }; // end of doInvite
      doInvite();
    } // end of if statement
    else {
      const errMsg = [];
      if (!email) {
        errMsg.push('your email is required');
      }
      Swal.fire({
        html: `Failed! ${errMsg.join(' and ')}.`,
        icon: 'info',
      });
    }
    form.email.value = ' ';
  };

  return (
    <div>
      {/* <script src="https://www.google.com/recaptcha/api.js" /> */}
      {/* <script src="sweetalert2.min.js" /> */}
      <link
        href="//fonts.googleapis.com/css?family=Lato:300,400,700,900,700italic|
        Open+Sans:700italic,400,600,300,700,800"
        rel="stylesheet"
        type="text/css"
      />
      <link rel="icon" type="image/x-icon" href="/images/favicon1.ico" />
      {/* <body> */}
      <main className="main">
        <div className="blogo">
          {/* <!-- main innerbox--> */}
          <div className="info">
            <div>
              <h1 className="hpe-developer-community">
                HPE Developer Community
              </h1>
              <p className="para">
                Where you'll find all things software at HPE. Join us to
                collaborate and build applications and integrations with HPE
                products using the latest software and open source technologies.
              </p>
              <p className="email">
                Enter your email below to join HPE Developer Community on Slack!
              </p>
              <form className="form" id="join-form" onSubmit={onsubmit}>
                <input
                  className="field"
                  type="email"
                  name="email"
                  autoComplete="off"
                  required
                  placeholder="Email Address"
                  id="slack-email"
                />
                <input
                  className="submit"
                  type="image"
                  name="submit"
                  src="/images/arrow.svg"
                  alt="submit"
                />
              </form>
            </div>
          </div>
          <div className="container">
            <div className="column2" />
            <div className="column3">
              <img
                className="hero_pic hero-pic"
                alt="hpe dev logo"
                src="/images/hero-pic.png"
              />
            </div>
          </div>
        </div>
      </main>
      {/* </body> */}
    </div>
  );
}
