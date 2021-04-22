# HPE DEV External Contributor Guide
**Version 1.0**

21-Apr-2021

## Table of Contents

[Introduction](#introduction)

[Getting started](#getting-started)

[Contributing a new blog](#contributing-a-new-blog)

[Editing a blog post that is already published](#Editing-a-blog-post-that-is-already-published)

[Editing a platform page](#editing-a-platform-page)

[Adding an Event](#adding-an-event)

[Tips and trick using the CMS Editor](#tips-and-trick-using-the-cms-editor)




## Introduction

This guide is intended for anyone interested in contributing to the HPE
Developer Community (https://hpedev.io). The document covers how to
contribute a new blog, or how to update a platform page.

The process describe in this guide requires minimum familiarity with Git
and an account on GitHub.com. You can find a tutorial on Git in this
[3-part blog article](https://developer.hpe.com/blog/get-involved-in-the-open-source-community-part-1-getting-started-with-gi).

Please contact [mailto://hpedev\@hpe.com](mailto://hpedev@hpe.com) for more support.

## Getting started

1.  Make sure you are connected to your personal GitHub account. If you
    don't have an account, you can create one now [here](https://github.com/join).


2.  Open the Netlifly Content Management System (CMS) at
    [https://developer.hpe.com/admin](https://developer.hpe.com/admin)
    and select login with GitHub. 

<center><img src="media/guide-login-with-Github.png" width="600" height="300"></center>


3.  Select **Fork the repo** to initiate a copy of the HPE DEV Web CMS
    into your own GitHub account. (In GitHub, this will appear as a new
    repository: "yourAccountname/hpe-dev-portal"). This private copy of
    the repository is going to be used to make your changes to the web
    site, before submitting them to the HPE DEV team.

<center><img src="media/guide-fork-repo.png" width="600" height="363"></center>


4.  You can view this forked repo in your repository list of your GitHub
    account

<center><img src="media/guide-forked-repo-in-your-GitHub.png" width="800" height="185"></center>


5.  In Netlify CMS, you are now working with your own copy of the HPE
    DEV CMS, and you get presented with a **Contents** menu which allows
    to change all sections of the web site. This guide, however, covers
    only changes to the **Blog** and **Platforms** sections.

>Note: Please engage with the team before proposing changes to other
sections.

<center><img src="media/guide-contents-blog-platform.png" width="800" height="356"></center>

## Contributing a new blog
You can create a new blog directly from the **Contents** tab or by navigating to the **Workflow** tab. Here you will create a new blog directly from the **Contents** tab.

1.  From the **Contents** tab, select the **Blog** section, and click the **New Blog** button

<center><img src="media/guide-blog-Contents-new-post.png" width="800" height="497"></center>


2.  In the blog editor, you can set properties (title, author name, author picture) in the left pane and see
    the effect in the preview pane on the right side of the screen

<center><img src="media/guide-blog-new-post-properties.png" width="1100" height="500"></center>


3.  Make sure you set:

-   Title
-   Author
-   Author Image (image size recommended is **96px X 96px**). 
    You can upload a picture or use your gravatar picture URL if you have one. 
    >Note: For more information on how to get a gravatar URL, refer to section "***Tips and Tricks using the CMS Editor***" at the end of this document.


4.  Start writing the content using either **Rich Text** mode or **Markdown** mode in the Body canvas   

<center><img src="media/guide-blog-body.png" width="700" height="410"></center>

* Use **Markdown** mode when your source file is in Markdown file or when you are familiar with Markdown syntax. If your content is already in Markdown, simply use copy (CTRL+C) and paste the content in **plain text** (**CTRL+SHIFT+V**) in the body.
* Use **Rich Text** mode when your source file is an MS-Word document or a RTF document: simply copy the content from your source file and paste the content in **plain text** (**CTRL+SHIFT+V**) in the body.

 >Note: To get started using the CMS editor for common elements (headings, list, code blocks, bold, italics, image), refer to section "***Tips and Tricks using the CMS Editor***" at the end of this document.
    
    
5. Tag your blog post

You can tag your post to tie it to one of the HPE DEV "Platform" pages on the HPE DEV portal. 
Use tags as one way to optimize your blog post for results from search engines such as Google search engine. You do so by tagging your article with popular keywords (1 to 4 keywords) that reflect your topic relevancy. Visit the site here to look for existing tags in our HPE DEV site: https://hpe-dev-portal.netlify.app/tags/ 


>Note: For more information on how to use tags refer to section "***Tips and Tricks using the CMS Editor***" at the end of this document.
    
    
6.  As you are adding content to the **Body** area, you can preview your blog on the right pane.

>Note: The text font size in the preview area will be smaller similar to the final rendering of the blog post in HPE DEV portal. 

<center><img src="media/guide-blog-preview-area.png" width="1000" height="458"></center>


7.  When ready **Save** your work. 
Click **Save** to save your latest edits.

<center><img src="media/guide-blog-save.png" width="513" height="65"></center>

>Note: Click **UNSAVED CHANGES** to exit the CMS editor without saving your changes. Click **Delete unpublished entry** to delete the post entry.


8.  Wait until document is saved


9.  When Saved, click on **Writing in Blog collection, CHANGES SAVED** to exit the CMS editor and return to the **Editorial Workflow** or **Contents** section

<center><img src="media/guide-blog-changes-saved.png" width="464" height="54"></center>


10. From the top menu bar, make sure **Workflow** is selected. Your blog is now visible in the **Drafts** column of the **Editorial Workflow**.

<center><img src="media/guide-blog-workflow-in-draft.png" width="800" height="331"></center>


11. Review/edit until ready. When you are satisfied with the edition of the blog post, move it to the **In Review** column (drag & drop the
    blog from the **Workflow** area).

<center><img src="media/guide-blog-workflow-move-draft-to-In-Review.png" width="800" height="321"></center>

Or use the **Set Status** button at the top right of the screen as shown here:

<center><img src="media/guide-blog-workflow-Set-Status-to-In-Review.png" width="336" height="126"></center>


12. From the Editorial Workflow section, select your article, now **In Review** column. You will see its status **Check for Preview** in the editor at the top right.

<center><img src="media/guide-blog-check-for-preview.png" width="301" height="60"></center>


13. After a few minutes, notice the **Check for Preview** at the top right which turned into **View Preview**. Click **View Preview** to open a preview of the web site and validate your changes. If needed, click **Check for Preview** to refresh the status.

<center><img src="media/guide-blog-status-View-Preview.png" width="435" height="56"></center>

Clicking **View Preview** will open your blog post in a new browser tab for your review.

<center><img src="media/guide-blog-View-Preview.png" width="600" height="620"></center>


14. As soon as the blog was placed **In Review,** a Pull Request (PR) is automatically opened on the HPE DEV team's GitHub repository, with the changes you are proposing.

<center><img src="media/guide-blog-pull-request.png" width="1000" height="337"></center>


15. Once you are satisfied with your blog entry, notify the HPE DEV team [mailto://hpedev\@hpe.com](mailto://hpedev@hpe.com) about your new post submission for review.
HPE DEV team will then proceed with an editorial review and will get in touch with you shortly.

>**Note:** *Moving the blog post back to the **Drafts** column of the CMS will withdraw the PR. You can also continue to make changes to your blog while the blog is **In Review**. This will be automatically synchronized in the PR (as additional Commits). This will be particularly helpful when receiving feedback from the HPE DEV Team.*

>**Note:** *Once the team has agreed to accept your contribution, the PR will be merged, the blog post will be published to the HPE DEV portal and the blog entry will disappear from your Editorial Workflow.*


## Editing a blog post that is already published


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

7.  A Pull Request (PR) was automatically opened on the HPE DEV team's
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
    merged, the platform page will be updated in HPE DEV Portal and the
    platform page will disappear from your Editorial Workflow.

## Adding an Event

It is possible to add a card to communicate about an important external event or conference you are contributing to. This will be visible on https://developer.hpe.com/events.

To do so:

1. From the CMS, on top menu bar select **Contents**, then click **Events** and press **New event**. This will open the Event wizard.

<center><img src="media/guide-event-Contents-new-event.png" width="800" height="626"></center>

2. Make sure to set the event properties: 
   - Event tile: name of the event or conference.
   - Start date and end date (used by the platform to order and handle upcoming/past status).
   - Category of the event. Select **Event** for in-person event and conference. Select **Virtual Event** for virtual event and conference.
   - Thumbnail Image: a picture for the event. Click **Choose an image** to upload and select a picture. Select **Insert from URL** to enter a link URL for your image.
   - Navigation path: an URL to navigate to register or find out more about the event and conference. This is typically the URL to the event or conference.
   - Leave card size to **large**
   - Tag: specify a keyword for your event or conference. Typically this is the name of your event (for example: Discover, KubeCon).

      <center><img src="media/guide-event-new-event-properties.png" width="600" height="768"></center>
      
3. For the Body, the content of the card for the event using the following guidelines: 
      - Title (use Heading level 2 for title)
      - Subtitle (optional - use Heading level 3 for subtitle)
      - Date (Month Date-Date, YYYY - for example: May 04-07, 2021)
      - Description

   <center><img src="media/guide-event-body.png" width="700" height="330"></center>

4.   When ready **Save** your changes. Wait until the document is saved.

     >Note: Click **UNSAVED CHANGES** to exit the CMS editor without saving your changes. Click **Delete unpublished entry** to delete the event entry.

5.  When Saved, click on **Writing in Blog collection, CHANGES SAVED** to exit the CMS editor and return to the **Contents** section.

7.  From the top menu bar, select **Workflow** to navigate to the **Editorial Workflow** section.
    Your new event entry is now visible in the **Drafts** column of the **Editorial Workflow**.

6.  Review/edit your event entry until ready. When you are satisfied with the edition of the event entry, move it to the **In Review** column (drag & drop the
    event entry from the **Drafts** column to the **In Review** column). Or while you are in the Editor canvas for your event entry, use the **Set Status** button at the top right of the screen to set status of your new event entry to **In Review**.
    
7. From the Editorial Workflow section, select your event entry, now **In Review** column. You will see its status **Check for Preview** in the editor at the top right.
 
8. In the editor, after a few minutes, notice the **Check for Preview** at the top right which turned into **View Preview**. Click **View Preview** to open a preview of the web site and validate your changes. If needed, click **Check for Preview** to refresh the status.
    
9. Leave the editor using the **Changes Saved** option.
    
10. A Pull Request (PR) is automatically opened on the HPE DEV team's GitHub repository, with the changes you are proposing. 

11. Once you are satisfied with your event entry, notify the HPE DEV team [mailto://hpedev\@hpe.com](mailto://hpedev@hpe.com) about your new event submission for review.
HPE DEV team will then proceed with an editorial review and will get in touch with you shortly.

>**Note:** *Moving the event entry back to the **Drafts** column of the CMS will withdraw the PR. You can also continue to make changes to your event entry while it is **In Review** column. This will be automatically synchronized in the PR (as additional Commits). This will be particularly helpful when receiving feedback from the HPE DEV Team.*

>**Note:** *Once the team has agreed to accept your event entry, the PR will be merged, the event entry will be published to the HPE DEV portal and the event entry will disappear from your Editorial Workflow.*


## Tips and trick using the CMS Editor

-   Unless you have your post already written in markdown, it is
    recommended to use the "***Rich Text***" toggle option when editing
    your contribution post.

-   Always use the Preview to make sure the changes are what you wanted.
    The WYSINAWYG (not always)

-   When doing copy/paste from a MS-Word (or RTF) document to the CMS
    editor (*Rich Text* mode or *Markdown* mode) use the option
    "***Paste as plain text***" (**CTRL+SHIFT+V)** to not get unwanted
    XML fragment code syntaxes.

-   You can use pandoc (<https://pandoc.org/>) to convert a complex DOCX
    to Markdown

    ```bash
    pandoc -f docx -t markdown mydoc.docx -o mymarkdown.md
    ```

-   Author image size: **96 x 96** or use Gravatar picture URL as explained here:

    - Using your gravatar as an author picture

       - Use your email to setup your gravatar account (<https://gravatar.com>)

      - Compute your email MD5 hash by entering your email in <https://www.md5hashgenerator.com/>

      - Check that your picture is reachable with:
        [https://gravatar.com/avatar/\<YourHash\>?s=96](https://gravatar.com/avatar/%3cYourHash%3e?s=96)
        for example:
        [https://gravatar.com/avatar/7dd708edf1c50d4c45da80f60e3643e7**?s=96**](https://gravatar.com/avatar/7dd708edf1c50d4c45da80f60e3643e7?s=96)

      - Use this URL from now on, as your picture in the CMS (and elsewhere)

-   Headings: Select **H** in the "Rich Text" menu bar and select the
    heading level. To clear a Heading, select the text, click **H** in
    the menu bar, and click the Heading level previously selected.

    >**Note:** We recommend to use "**Header 2**" for your primary heading, then Header3 for subsequent heading, etc.

-   Insert an image:

    Small resolution image is recommended (width: 800px)

    -   Toggle to **Rich Text** mode in the editor (Body area)

    -   Select **+** to add an image component

    -   Upload the image stored on your PC/laptop and select image you have just uploaded. If you switch to **Markdow** mode, you will set the relative path to the image in
        the editor in the form: */img/myimage.png*.

-   Adjusting image size and its position:

    -   **Method 1:** Using your PC/Laptop, change image size using you preferred image editor (i.e.: Paint). Toggle to **Rich Text** mode and upload/select the resized image.                       Switching to **Markdown** mode, will give you the relative path to the image in the editor in the form: */img/myimage.png*.

    -   **Method 2:** Use HTML code to set the size (height, width) for your image. Toggle to **Rich Text** mode to insert your image. Then toggle to **Markdown** mode to obtain the relative path for your image (in the form: */img/myimage.png*) and and insert the HTML syntax below:

        \<img src=\"relative-path-of-your-image-in-the-form: /img/myimage.png\" width=\"600\" height=\"359\"\>

        >**Note:** If you wish to center an image, then you can use HTML code below:

         \<center\>\<img src=\"relative-path-of-your-image-in-the-form: /img/myimage.png\" width=\"500\" height=\"542\"\>\</center\>

        >**Note:** When using HTML code to insert an image, you will see an empty frame for your image in the preview area (right side of the CMS editor). The frame corresponds to the size of the image (width and height) in the blog post.

-   Horizontal separator: toggle to **Markdown** mode and use the "- - -" (without the quotation mark).

    >**Note:** Make sure to insert a line break before and after the horizontal separator.

-   Code block snippet:

    -   Make sure to always specified a syntax language (for example: ***\`\`\`yaml***)

    -   Make sure to insert a line break before and after a code block snippet

-   List items/sub-list items:
    It might be easier for you to toggle to **Markdown** mode in the editor and use the syntax below for creating item lists and sub-item lists:
    
    **Bullet list:**

       \*\<space\>bullet list item 1

       \*\<space\>bullet list item 2

       \*\<space\>bullet list item N
        
    **Numbered list:**

       1.\<space\>numbered list item 1

       2.\<space\>numbered list item 2

       N.\<space\>numbered list item N
        
    **Item list with Sub-item list:**

       \*\<space\>bullet list item 1

       \<space\>\<space\>\<space\>\*sub-item 1

       \<space\>\<space\>\<space\>\*sub-item 2

       \<space\>\<space\>\<space\>\*sub-item N

       >**Note:** Always insert a line break between a standard paragraph and the first item of a list

       >**Note:** By default, the bullet list items will be rendered with smaller font size than a text in a "standard" paragraph. If you wish to keep same character font as a standard paragraph, it is recommended to insert a line break between list items.

       Example **with line break** between first level list items and **no line break** between sub-list items:


       Example with **no line break** between list items:


-   **Tag:**

If appropriate, use a tag to tie your blog post to a "platform" page on HPE DEV portal. List of "platforms" tag is in the table below.

You can also tag your article with popular keywords (1 to 4 keywords) that reflect your topic relevancy. Use tags as one way to optimize your blog post for results from search engines such as Google search engine. Visit the site here to look for existing tags in our HPE DEV site: <https://hpe-dev-portal.netlify.app/tags/>



  | **Platform name**                  |   **Associated tag**    |
  | ---------------------------------- | ----------------------- |
  | **HPE Ezmeral Container Platform** | hpe-ezmeral-container-platform |
  | **HPE Ezmeral Data Fabric**        | hpe-ezmeral-data-fabric |
  | **HPE GreenLake**                  | hpe-greenlake |
  | **Spiffe and Spire**               | spiffe-and-spire-projects |
  | **Chapel**                         | chapel |
  | **Grommet**                        | grommet |
  | **HPE Deep Learning Cookbook**     | hpe-deep-learning-cookbook |
  | **Aruba Developer Hub**            | aruba |
  | **HPE 3PAR and Primera**           | hpe-3par-and-primera |
  | **HPE Nimble Storage**             | hpe-nimble-storage |
  | **HPE OneView**                    | hpe-oneview |
  | **HPE OneView Global Dashboard**   | hpe-oneview-global-dashboard |
  |**HPE SimpliVity**                  | hpe-simplivity |
  | **iLORESTful API**                 | ilo-restful-api |
  
                                      

-   For hotlink, open in new tab links (not found a good solution yet)
    except using a HTML tag
