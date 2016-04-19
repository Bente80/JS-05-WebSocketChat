/**
 * Created by Bente on 18-04-2016.
 */

angular.module('chat', [])

    .factory('socket', function ($rootScope) {
        // See: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
        // for further details about this wrapper
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    })

    .controller('mainController', function(socket){
        var scope = this;

        scope.messages = [];
        scope.users = [];
        scope.hello = true;

        scope.sendMessage = function() {
            socket.emit('message', scope.messageInput)
            scope.messageInput = '';
        };

        scope.createUser = function() {
            socket.emit('user', scope.userInput, function(data)
            {
                if(data){
                    scope.hello = false;
                }
                else{
                    console.log('ups');
                }
            });
            scope.userInput = '';
        };

        socket.on('message', function(message){
            scope.messages.push({
                body: message
            });
            console.log(message)                    //just added for test use
        });

        socket.on('user', function(user){
            scope.users.push({
                body: user
            })
            console.log(user);                       //just added for test use
        });

       /* socket.on('disconnect', function(user){         //----
            scope.users.push({                          //----
                body: user                              //----
            })                                          //----
            console.log(user);                          //----
        });  */                                           //----

    });