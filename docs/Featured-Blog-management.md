# How to manage featured blogs list and Featured blog in home page

Date: June 28, 2021
Author: HPE Developer Team

## Feature blog in the HPE Developer portal Home page
* From CMS v2 editor (as Administrator), go to [Home panels](https://hpe-dev-portal.netlify.app/admin/#/collections/homepanels)
* Edit the existing Feature blog card to set the Title, Navigation Path (relative path /blog/<title>; or full path of the post in the form of: https:developer.hpe.com/blog/<blog-title>), author image, Author name. Set priority (value: 7) and toggle on the "Active" flag option.
 
  >Note: if you want to remove a Featured Blog post from the home panel, simply toggle off the "Active" flag option.
  
* In the Body area enter a brief description of the blog post. 
  (note: Enter Date (if appropriate) as header level 4. An example is here:
 
 ### June 9 - August 4, 2021 (or June 22 - 25, 2021) (only needed for a time bound blog post -for example for the Dev Nation Survey)
 
 Save the changes in the CMS editor and wait 4 or 5 minutes for the check process to execute.
 
 Check the preview.
 
 >Note: If the title of the blog is too long, you might want to work with Dale to reduce the title of the Feature Blog card in order to avoid too much vertical white space in the card.
 
 When you are satisfied with the changes in your preview, merge the PR (delete the branched when prompted to do so).
 
 ## Featured blog list management
 * From the CMS v2 editor (as Administrator), go to [Blog](https://hpe-dev-portal.netlify.app/admin/#/collections/blog)
 * First, **toggle off** the FEATURED attribute of one of the Featured Blog and give the priority higher than 5. Review and merge the PR (delete the PR when prompted to do so).
 * Next, **toggle on** the FEATURED attribute for the blog you want to add to the Featured blog list, give appropriate priority (between 1 and 5), save, review and merge the PR (Delete the PR when prompted to do so)

