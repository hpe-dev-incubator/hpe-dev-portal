# How to manage featured blogs list and Featured blog in home page

Date: June 28, 2021
Author: HPE DEV Team

## Feature blog in the HPE DEV portal Home page
* From CMS v2 editor (as Administrator), go to [Home panels](https://hpe-dev-portal.netlify.app/admin/#/collections/homepanels)
* Edit the existing Featured blog card to set the Title, Navigation Path (relative path in the form of: /blog/<blog-title>), author image, and body.
* In the Body area, enter the Author name, Title of the blog as Header level 2, and Date (if appropriate) as header level 4. An example is here:
  
 Author Name
 
 ## Title of the blog
 
 ### June 9 - August 4, 2021 (or June 22 - 25, 2021) (the date here was valid for a Blog post about the Dev Nation Survey which was time bounded).
 
 Save the changes in the CMS editor and wait 4 or 5 minutes for the check process to execute.
 
 Check the preview.
 
 >Note: If the title of the blog is too long, you might want to work with Dale to reduce the title of the Feature Blog card in order to avoid too much vertical white space in the card.
 
 When you are satisfied with the changes in your preview, merge the PR (delete the branched when prompted to do so).
 
 ## Featured blog list management
 * From the CMS v2 editor (as Administrator), go to [Blog](https://hpe-dev-portal.netlify.app/admin/#/collections/blog)
 * First, **toggle off** the FEATURED attribute of one of the Featured Blog and give the priority highe than 5. Review and merge the PR (delete the PR when prompted to do so).
 * Next, **toggle on** the FEATURED attribute for the blog you want to add to the Featured blog list, give appropriate priority (between 1 and 5), save, review and merge the PR (Delete the PR when prompted to do so)

