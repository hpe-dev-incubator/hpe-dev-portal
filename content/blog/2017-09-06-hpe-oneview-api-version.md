---
title: HPE OneView API Version
date: 2017-09-06T13:41:38.185Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI"]
path: hpe-oneview-api-version
---
# Backward compatibility of API

In a previous article, we discussed how important it is to provide an
API with software so that your ecosystem can grow and other software
entities can integrate with it. But what happens when another release of
the software comes up? New capability maybe added, older behavior
modified, which is normal, but it makes it more difficult to allow the
software to evolve without disrupting the growing ecosystem. This is
where backward compatibility becomes critical. We, as API provider, need
to guarantee that existing software integrations are not going to break
when a new release is introduced.

In order to make this happen, API providers usually require integrators
to specify the version of the API that they expect. In most REST APIs,
this is done with a HTTP Header. And the API provider guarantees that
older versions of the API remain unchanged. Of course if an integrator
wants to benefit from the newest functionality, it will have to update
their software to use the newest API, but the older version, running
against the older API, should continue to work without modification. It
is the API provider’s decision to decide how many older versions of the
API are supported at any given release and deprecate older ones if
necessary.

# HPE OneView API history

The HPE OneView API has been around for a few years already and the
table below shows the versions of the API for each release

| Product Version | API Version Number/ X-API-Version | Date           |
|-----------------|-----------------------------------|----------------|
| 1.0             | 3                                 | September 2013 |
| 1.05            | 4                                 | March 2014     |
| 1.10            | 101                               | June 2014      |
| 1.20            | 120                               | December 2014  |
| 2.0             | 200                               | October 2015   |
| 3.0             | 300                               | October 2016   |
| 3.1             | 500                               | July 2017      |

# Make a decision…

Ok, so I am a partner in the HPE Composable API ecosystem, and I'm about
to make use of the HPE OneView API. Which version should I use? You
should always use the latest release when starting a new integration
project. You can look up `currentVersion` by using the `GET /rest/version`
as we did in a previous article. If you expect a long development cycle,
engage with your contact in the Composable API Ecosystem, to check what
the best approach is. There may already be a newer version in beta,
which you may be able to leverage.

# And stick to it!

Once you have decided, you should make sure that your application only
uses that particular release (and let us call it `expectedVersion`).
Remember that several months down the road, there will be new releases,
which you do not really know about at the time of the writing of your
code. You cannot be sure that your application will work well against a
future release.

So let us recap. In your code, as the first thing, you should implement
the following algorithm to determine that the version of the API that
you expect to be present, is indeed present and supported by the
appliance instance you are about to integrate with.

1.  Call `GET /rest/version`

2.  Retrieve `minimumVersion` and currentVersion

3.  Check that `minimumVersion` &lt;= `expectedVersion` &lt;= `currentVersion`

4.  If not then raise an error: "Sorry, cannot integrate with this
    version of HPE OneView"

5.  Otherwise set HTTP Header `X-API-Version` to `expectedVersion` for *all*
    subsequent API calls

# Plan your updates on a regular basis

HPE supports up to three versions prior to the current one. Therefore,
in theory, the above algorithm will allow your software to work across
many HPE OneView releases, and over a long period. Ultimately, there
will be a time where `minimumVersion` will become greater than
`expectedVersion` and the error message will show up (point 4). This is
not a great user experience for your user community, so you should
always do your best to upgrade your software and crank up the
`expectedVersion`, before this message hits your users.
