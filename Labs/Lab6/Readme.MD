

Conversion to CSV seems more appropriate on the Node server than in an angular component; ETL falls under the domain of the model rather than the controller.


Had an interesting problem where I was assigning a socket to a global variable for access in a function call but it would only output when the socket was logged via the console. Not sure why it did that but I rewrote it to pass the socket into the function that needed it.