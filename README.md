# NeighbourChat (Naybur)
See it working: http://naybur.azurewebsites.net/

## WTF is Naybur?
It's a way to talk to or communicate with people in your area.

## WHY?
Ever wanted to ask your neighbours to be quieter but don't want to be THAT PERSON?

Or imagine if you could ask your whole road if you could borrow their lawnmower / spade / cat? 

Well that's where this idea spawned.

## HOW?
This site is created using an NodeJS server (hosted on Azure). 

The chat system is live, using Sockets.IO and uses the postcode as a room
name.

Messages are then saved into a MySQL db with postcode, message and time and then recieved again on postcode load
