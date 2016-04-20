/**
 * Created by Bente on 18-04-2016.
 */

module.exports = function(socket) {

    function broadcast(type, payload) {
        socket.broadcast.emit(type, payload);
        socket.emit(type, payload);           // What this line does is that it also showes the client that writes
                                               // the message, what it has written.
    }

    socket.on('message', function(message){

        var date = new Date();
        var hour = date.getHours();
        var minuts = date.getMinutes();
        var time = hour+':'+minuts;
        broadcast('message',time+' ('+socket.username+') '+message);

        /* man kunne også have gjort:
        var now = new Date();
        var now_utc = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        broadcast('message',now_utc.toTimeString().substring(0, 5)+' '+message);*/
    });

    users = [];

    socket.on('user', function (data, callback) {  // Here it is very importent to also use the name "user" in the js file for the frontend!!!
        if (users.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            users.push(socket.username);
        //broadcast('user',data);                                         //---- føre skrev jeg ('user', users)
            }
        broadcast('user','user connected: '+socket.username);          //---- før stod der message her, men nu har jeg skrevet user
    });                                                                 //---- for at få beskederne ud det rigtige sted!

    socket.on('disconnect', function (data) {               //----
        if (!socket.username) return;                       //----      det er derfor jeg kan se når der er nogle der logger af
        users.splice(users.indexOf(socket.username), 1);    //----      den viser dog ikke hvem det er.
        broadcast('user',data);                                    //----
    });                                                     //----
};