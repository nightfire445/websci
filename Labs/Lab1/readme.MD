Solomon Mori Lab1:


Some indexes in the JSON did not have a text property so whenever I encountered one I'd skip it and get the next tweet in the list.

For the supplementary feed I worked through a heirachy of entities, if one was missing, I'd try a different one. 
The heirarchical Output was as follows.
-Hashtag (clickable link to find twitter posts with the tag)
--User Mentions (clickable link to Username's page on twitter)
---URL (clickable link to open the url)
---- "No supplementary data"

I color coded the corresponding tweet and supplementary information to make the relation more clear.

Had the two unordered lists animate using Jquery's slideUp() & slideDown() function for entrances and exits.

Used bootstrap for responsiveness

