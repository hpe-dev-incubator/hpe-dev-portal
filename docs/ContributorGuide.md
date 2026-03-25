# HPE Developer External Contributor Guide
**Version 1.0**

16-MAR-2021

## Table of Contents

[Introduction](#introduction)

[Getting started](#getting-started)

[Contributing a new blog](#contributing-a-new-blog)

[Editing a platform page](#editing-a-platform-page)

[Adding an Event](#adding-an-event)

[Tips and trick using the CMS Editor](#tips-and-trick-using-the-cms-editor)



## Introduction

This guide is intended for anyone interested in contributing to the HPE
Developer Community (https://hpedev.io). The document covers how to
contribute a new blog, or how to update a platform page.

The process describe in this guide requires minimum familiarity with Git
and an account on GitHub.com. You can find a tutorial on Git in this
3-part blog article:
<https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi>

**Note:** A recording of the training session delivered on April 30, 2021 is available [here](https://vimeo.com/544486602). 

Please contact [mailto://hpedev\@hpe.com](mailto://hpedev@hpe.com) for
more support.

## Getting started

1.  Make sure you are connected to your personal GitHub account. If you
    don't have an account, you can create one now here
    (https://github.com/join).

2.  Open the Netlifly Content Management System (CMS) at
    [https://developer.hpe.com/admin](https://developer.hpe.com/admin)
    and select login with GitHub. You may be prompted to authorize to
    enter your GiHub account password.

> ![Graphical user interface, text Description automatically
> generated](media/image1.png){width="5.142445319335083in"
> height="2.73in"}

3.  Select **Fork the repo** to initiate a copy of the HPE Developer Web CMS
    into your own GitHub account. (In GitHub, this will appear as a new
    repository: "yourAccountname/hpe-dev-portal"). This private copy of
    the repository is going to be used to make your changes to the web
    site, before submitting them to the HPE Developer team.

> ![Graphical user interface, text, application Description
> automatically generated](media/image2.png){width="5.14in"
> height="2.3662674978127733in"}

4.  You can view this forked repo in your repository list of your GitHub
    account

![Graphical user interface Description automatically generated with
medium confidence](media/image3.png){width="3.3891896325459316in"
height="0.76in"}

5.  In Netlify CMS, you are now working with your own copy of the HPE
    DEV CMS, and you get presented with a **Contents** menu which allows
    to change all sections of the web site. This guide, however, covers
    only changes to the **Blog** and **Platforms** sections.

>Note: Please engage with the team before proposing changes to other
sections.

> ![Graphical user interface, application Description automatically
> generated](media/image4.png){width="6.16in"
> height="2.6384022309711286in"}

## Contributing a new blog

1.  Select the Blog section of the CMS, and use the **New Blog** button

> ![Graphical user interface, application, Teams Description
> automatically generated](media/image5.png){width="6.5in"
> height="3.9902777777777776in"}

2.  In the blog editor, you can set properties in the left pane and see
    the effect in the preview pane on the right side of the screen

> ![Graphical user interface, text, application, chat or text message
> Description automatically generated](media/image6.png){width="6.5in"
> height="3.1680555555555556in"}

3.  Make sure you set:

-   Title

-   Author

-   Author Image (image size 96px X 96px). You can upload a picture or
    use your gravatar picture URL if you have one. Refer to section
    "***Tips and Tricks using the CMS Editor***" at the end of this
    document.

4.  Start writing the content using RTF or Markdown

> ![Graphical user interface, text, application, email Description
> automatically generated](media/image7.png){width="4.87in"
> height="3.8398075240594927in"}

5.  Preview your blog on the right pane.

> ![Graphical user interface, text, application Description
> automatically generated](media/image8.png){width="6.5in"
> height="2.897222222222222in"}

6.  You can add one or more tags from the official tags list located on
    (<https://hpe-dev-portal.netlify.app/tags/> )

7.  When ready **Save** your work. Or use UNSAVED CHANGES to exit
    without saving changes.

> ![Text Description automatically generated with medium
> confidence](media/image9.png){width="2.931428258967629in"
> height="0.54in"}

8.  Wait until document is saved

9.  When Saved, click on "Writing in Blog collection, CHANGES SAVED" to
    exit the editor.

> ![](media/image10.png){width="4.8051607611548555in" height="0.56in"}

10. Your blog is now visible in the **Drafts** column of the **Editorial
    Workflow**.

![Graphical user interface, application, Teams Description automatically
generated](media/image11.png){width="5.055555555555555in"
height="3.8333333333333335in"}

11. Review/edit until ready. When you are satisfied with the edition of
    the blog post, move it to the **In Review** column (drag & drop the
    blog from the **Workflow** area) or using the **Set Status** button
    at the top right of the screen.

> ![Graphical user interface, text, application, chat or text message
> Description automatically generated](media/image12.png){width="2.81in"
> height="1.0526345144356954in"}

12. Select your article, now **In Review** and, in the editor, after a
    few minutes, notice the **Check for Preview** at the top right which
    turned into **View Preview**. Click **View Preview** to open a
    preview of the web site and validate your changes. Click **Check for
    Preview** to refresh.

> ![Text, icon Description automatically
> generated](media/image13.png){width="3.188254593175853in"
> height="0.6152777777777778in"}![Icon Description automatically
> generated](media/image14.png){width="3.0456517935258094in"
> height="0.5927777777777777in"}
>
> ![Graphical user interface, text, application, email Description
> automatically generated](media/image15.png){width="5.61in"
> height="2.5766437007874017in"}

13. As soon as the blog was placed **In Review,** a Pull Request (PR)
    was automatically opened on the HPE Developer team's GitHub repository,
    with the changes you are proposing. We will review and get in touch
    with you shortly.

    If you open the hpe-dev-portal repo you can see this new PR

![Graphical user interface, text, application Description automatically
generated](media/image16.png){width="6.5in"
height="1.2118055555555556in"}

14. Moving the blog post back to the **Drafts** column of the CMS will
    withdraw the PR. You can also continue to make changes to your blog
    while the blog is **In Review**, this will be automatically
    synchronized in the PR (as additional Commits). This will be
    particularly helpful when receiving feedback from the HPE Developer Team.

15. Once the team has agreed to accept your contribution, the PR will be
    merged, the blog post will be published to the HPE Developer portal and
    the blog entry will disappear from your Editorial Workflow..


## Editing a platform page

1.  From the CMS, select **Platforms** and locate the platform to edit
    (HPE Ezmeral Data Fabric in our example).

> ![Graphical user interface, application Description automatically
> generated](media/image17.png){width="6.5in"
> height="4.163194444444445in"}

2.  In the editor, make the required changes using Rich Text or
    Markdown. Verify content in the preview pane on the right side of
    the screen.

> ![Graphical user interface, website Description automatically
> generated](media/image18.png){width="5.98in"
> height="2.7088888888888887in"}

3.  When ready **Save** your changes.

> ![](media/image19.png){width="5.44in" height="0.5473173665791776in"}

4.  In the editor, after a few minutes, notice the **Check for Preview**
    at the top right which turned into **View Preview**. Click **View
    Preview** to open a preview of the web site and validate your
    changes. Click **Check for Preview** to refresh.

> ![Text, icon Description automatically
> generated](media/image13.png){width="3.188254593175853in"
> height="0.6152777777777778in"}![Icon Description automatically
> generated](media/image14.png){width="3.0456517935258094in"
> height="0.5927777777777777in"}

![Graphical user interface, text, application, email Description
automatically generated](media/image20.png){width="6.5in"
height="2.9208333333333334in"}

5.  Leave the editor using the **Changes Saved** option.

> ![](media/image19.png){width="5.44in" height="0.5473173665791776in"}

6.  Select the Editorial Workflow view using **Workflow** from the menu
    bar. The platform page is now in the **Drafts** column. When ready
    drag/drop entry to the **In Review** column.

> ![Graphical user interface, application, Teams Description
> automatically generated](media/image21.png){width="6.5in"
> height="3.154861111111111in"}

7.  A Pull Request (PR) was automatically opened on the HPE Developer team's
    GitHub repository, with the changes you are proposing. We will
    review and get in touch with you shortly.

> If you open the hpe-dev-portal repo you can see this new PR
>
> ![Graphical user interface, text, application, Teams Description
> automatically generated](media/image22.png){width="6.5in"
> height="1.2152777777777777in"}

8.  Moving the platform back to the **Drafts** column of the CMS will
    withdraw the PR. You can also continue to make changes to your
    platform page while the page is **In Review**, this will be
    automatically synchronized in the PR (as additional Commits). This
    will be particularly helpful when receiving feedback from the HPE
    DEV Team.

9.  Once the team has agreed to accept your contribution, the PR will be
    merged, the platform page will be updated in HPE Developer Portal and the
    platform page will disappear from your Editorial Workflow.

## Adding an Event

It is possible to add a card to communicate about an important external event you are contributing to. This will be visible on https://developer.hpe.com/events.
To do so:
1. From the CMS select Content, then Events and press New event
2. Make sure to set: 
 - Name of the event
 - Start and end date (used by the platform to order and handle upcoming/past status)
 - Type of event (Physical or virtual)
 - A picture for the event (uploaded picture or URL)
 - Leave card size to large
 - A URL to navigate to register or find out more about the event
 - The content of the card for the event using the following guidelines:
   - Title
   - Subtitle
   - Date
   - Description
3.  When ready **Save** your changes.
4.  In the editor, after a few minutes, notice the **Check for Preview**
    at the top right which turned into **View Preview**. Click **View
    Preview** to open a preview of the web site and validate your
    changes. Click **Check for Preview** to refresh.
5.  Leave the editor using the **Changes Saved** option.
6.  Select the Editorial Workflow view using **Workflow** from the menu
    bar. The platform page is now in the **Drafts** column. When ready
    drag/drop entry to the **In Review** column.
7.  A Pull Request (PR) was automatically opened on the HPE Developer team's
    GitHub repository, with the changes you are proposing. We will
    review and get in touch with you shortly.

## Tips and trick using the CMS Editor

-   Unless you have your post already written in markdown, it is
    recommended to use the "***Rich Text***" toggle option when editing
    your contribution post.

-   Always use the Preview to make sure the changes are what you wanted.
    The WYSINAWYG (not always)

-   When doing copy/paste from a MS-Word (or RTF) document to the CMS
    editor (Rich Text or Markdown toggle option) use the option
    "***Paste as plain text***" (**CTRL+SHIFT+V)** to not get unwanted
    XML fragment code syntaxes.

-   You can use pandoc (<https://pandoc.org/>) to convert a complex DOCX
    to Markdown

```bash
pandoc -f docx -t markdown mydoc.docx -o mymarkdown.md
```

-   Author image size: **96 x 96** or use Gravatar picture URL (see
    below for details)

-   Using your gravatar as an author picture

    -   Use your email to setup your gravatar account
        (<https://gravatar.com>)

    -   Compute your email MD5 hash by entering your email in
        <https://www.md5hashgenerator.com/>

    -   Check that your picture is reachable with:
        [https://gravatar.com/avatar/\<YourHash\>?s=96](https://gravatar.com/avatar/%3cYourHash%3e?s=96)
        for example:
        [https://gravatar.com/avatar/7dd708edf1c50d4c45da80f60e3643e7**?s=96**](https://gravatar.com/avatar/7dd708edf1c50d4c45da80f60e3643e7?s=96)

    -   Use this URL from now on, as your picture in the CMS (and
        elsewhere)

-   Headings: Select **H** in the "Rich Text" menu bar and select the
    heading level. To clear a Heading, select the text, click **H** in
    the menu bar, and click the Heading level previously selected.

    -   Use "**Header 2**" for primary heading, then Header3 for
        subsequent heading, etc\...

-   Insert an image:

Small resolution image is recommended (width: 800px)

-   Use the "Rich text" toggle option

-   Select + to add an image component

-   Upload the image, select image

-   Adjusting image size and its position

    -   Change image size using you preferred image editor (I.e.: Paint)

    -   Toggle to "***Rich Text***" option and upload/select the resized
        image. This will also give you the relative path to the image in
        the editor.

    -   **Another option** is to use HTML code to set the size (height,
        width) for your image while you insert it into the post. Toggle
        to ***"Markdown***" option, and insert the HTML syntax below:

\<img src=\"\<relative path of your image in the form:
/img/myimage.png\" width=\"600\" height=\"359\"\>

-   If you wish to center an image, take note of your preferred
    resolution size, then you can use HTML code below:

> \<center\>\<img src=\"relative path of your image in the form
> /img/myimage.png\" width=\"500\" height=\"542\"\>\</center\>
>
> **[Note:]{.ul}** In the preview canvas, you will see an empty frame
> for your image. The frame corresponds to the size of the image (width
> and height) in the blog post.

-   If using a horizontal separator, you can use the "Markdown" mode and
    use the

> "- - -" (without the quotation mark).

Make sure to insert a line break before and after the horizontal
separator.

-   Code block snippet:

    -   Make sure to always specified a syntax language (for example:
        ***\`\`\`yaml***)

    -   Make sure to insert a line break before a code block snippet

-   List items/sub-list items:

> It might be easier for you to go to "Markdown" mode in the editor and
> use the syntax below for creating item lists and sub-item lists:
>
> \*\<space\>bullet list item 1

\*\<space\>bullet list item 2

\*\<space\>bullet list item N

1.\<space\>numbered list item 1

2.\<space\>numbered list item 2

N.\<space\>numbered list item N

\*\<space\>bullet list item 1

\<space\>\<space\>\<space\>\*sub-item 1

\<space\>\<space\>\<space\>\*sub-item 2

\<space\>\<space\>\<space\>\*sub-item N

-   Insert a line break between a paragraph and the first item of a list

-   By default, the bullet list items will be rendered with smaller font
    size than a text in a "standard" paragraph.

-   If you wish to keep same character font as a standard paragraph, it
    is recommended to insert a line break between list items.

Example **with line break** between first level list items and **no line
break** between sub-list items:

> ![](media/image23.png){width="6.5in" height="2.6381944444444443in"}
>
> Example with **no line break** between list items:
>
> ![](media/image24.png){width="6.5in" height="2.00625in"}

-   **Tag:**

> If appropriate, use a tag to tie your blog post to a "platform" page
> on HPE Developer portal. List of "platforms" tag is in the table below.
>
> You can also tag your article with popular keywords (1 to 4 keywords)
> that reflect your topic relevancy. Use tags as one way to optimize
> your blog post for results from search engines such as Google search
> engine. Visit the site here to look for existing tags in our HPE Developer
> site: <https://hpe-dev-portal.netlify.app/tags/>

```
  **Platform name**                    **Associated tag**
  ------------------------------------ --------------------------------
  **HPE Ezmeral Container Platform**   hpe-ezmeral-container-platform
  **HPE Ezmeral Data Fabric**          hpe-ezmeral-data-fabric
  **HPE GreenLake**                    hpe-greenlake
  **Spiffe and Spire**                 spiffe-and-spire-projects
  **Chapel**                           chapel
  **Grommet**                          grommet
  **HPE Deep Learning Cookbook**       hpe-deep-learning-cookbook
  **Aruba Developer Hub**              aruba
  **HPE 3PAR and Primera**             hpe-3par-and-primera
  **HPE Nimble Storage**               hpe-nimble-storage
  **HPE OneView**                      hpe-oneview
  **HPE OneView Global Dashboard**     hpe-oneview-global-dashboard
  **HPE SimpliVity**                   hpe-simplivity
  **iLORESTful API**                   ilo-restful-api
```                                       

-   For hotlink, open in new tab links (not found a good solution yet)
    except using a HTML tag
