(function() {
    var pressedKeys = {};

    function setKey(event, status,eventName) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            {
                console.log(player.pos[1])
                key = 'UP';
                 if(player.pos[1] < 800){
                    status = false;
                    event.preventDefault();
                    event.stopPropagation();
                // }else{
                //     status = true;
                 }
            }
             break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
            setKey(e, true, 'keydown');
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false, 'keyup');
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();