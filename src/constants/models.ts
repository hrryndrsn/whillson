


/*
user comes in -> user == anon user
- show home page with login button
- render 'open version' of the app
- if user is anonymous, don't send db calls 

user logs in 
- show homepage with user name + profile + link to hill charts index
- save the state of the current hill 
- when the user makes changes, update and send db calls

pages 

"/" -> render basic hill component with no saving
"/hillcharts" -> hillchart index page. show cards with the name of each (picture streach goal)
"/hillcharts${id}" -> individual hill 
*/