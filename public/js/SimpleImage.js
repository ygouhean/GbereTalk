// Fonctions utilitaires privées, ajout de __ pour réduire les chances qu'elles entrent en conflit avec les noms de méthodes de quelqu'un d'autre
var __SimpleImageUtilities = (function () {
    // variables globales privées
    // image nécessaire pour initialiser l'image "dimensionnée"
    var EMPTY_IMAGE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAQAAAAnZu5uAAAAAXNSR0IArs4c6QAAABVJREFUeJxiYPgPhyQwAQAAAP//AwCgshjoJhZxhgAAAABJRU5ErkJggg==';
    // nombre de canvas créés pour contenir des images
    var globalCanvasCount = 0;
    // charge l'image en l'enveloppant dans un élément HTML
    function makeHTMLImage (url, name, simpleImage, loadFunc) {
        if (loadFunc == null) {
            loadFunc = function() {
                simpleImage.__init(this);
            }
        }
        var img = new Image();
        img.onload = loadFunc;
        img.src = url;
        img.id = name;
        img.style.display = 'none';
        return img;
    }

    // fonctions utilitaires publiques
    return {
        // crée une image vide pour qu'elle soit mise en cache pour des utilisations futures
        EMPTY_IMAGE: makeHTMLImage(EMPTY_IMAGE_DATA, 'EMPTY', null, function () {}),

        // crée un élément canvas
        makeHTMLCanvas: function (prefix) {
            var canvas = document.createElement('canvas');
            canvas.id = prefix + globalCanvasCount;
            canvas.style.display = 'none';
            canvas.innerHTML = 'Votre navigateur ne prend pas en charge HTML5.'
            globalCanvasCount++;
            return canvas;
        },

        // obtient une image à partir d'un input de fichier téléchargé
        makeHTMLImageFromInput: function (file, simpleImage) {
            var reader = new FileReader();
            reader.onload = function() {
                makeHTMLImage(this.result, file.name.substr(file.name.lastIndexOf('/') + 1), simpleImage);
            }
            reader.readAsDataURL(file);
            return null;
        },

        // obtient une image à partir d'une URL relative
        makeHTMLImageFromURL: function (url, simpleImage) {
            var name = url.substr(0, url.indexOf(';'));

            if (url.substr(0, 4) != 'http') {
                return makeHTMLImage(url, name, simpleImage);
            }
            else {
                // ne fonctionne pas --- le chargement d'une image à partir d'une URL corrompt le canvas, donc nous ne pouvons pas l'utiliser :(
                __SimpleImageUtilities.throwError('Malheureusement, vous ne pouvez pas créer directement une SimpleImage à partir d\'une URL: ' + url);
            }
        },

        // crée une image vide de la taille donnée
        makeHTMLImageFromSize: function (width, height) {
            var img = __SimpleImageUtilities.EMPTY_IMAGE.cloneNode(true);
            img.width = width;
            img.height = height;
            return img;
        },

        // définit la taille de l'image aux valeurs données, en mettant à l'échelle les pixels
        changeSize: function (canvasOld, newWidth, newHeight) {
            var canvasNew = __SimpleImageUtilities.makeHTMLCanvas('setSize_');
            canvasNew.width = newWidth;
            canvasNew.height = newHeight;
            // dessine l'ancien canvas sur le nouveau
            var contextNew = canvasNew.getContext('2d');
            contextNew.drawImage(canvasOld, 0, 0, newWidth, newHeight);
            return contextNew.getImageData(0, 0, newWidth, newHeight);
        },

        // limite les valeurs pour qu'elles soient dans l'intervalle 0..255
        clamp: function (value) {
            return Math.max(0, Math.min(Math.floor(value), 255));
        },

        // pousse les modifications locales accumulées vers l'écran
        flush: function (context, imageData) {
            if (imageData != null) {
                context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
            }
        },

        // appelé pour abandonner avec un message
        throwError: function (message) {
            throw new Error(message);
        },

        // appelé par les fonctions orientées utilisateur pour vérifier le nombre d'arguments
        funCheck: function (funcName, expectedLen, actualLen) {
            if (expectedLen != actualLen) {
                var s1 = (actualLen == 1) ? '' : 's';  // pluralise correctement
                var s2 = (expectedLen == 1) ? '' : 's';
                var message = 'Vous avez essayé d\'appeler ' + funcName + ' avec ' + actualLen + ' valeur' + s1 +
                              ', mais elle attend ' + expectedLen + ' valeur' + s2 + '.';
                // un jour : réfléchir à "values" vs. "arguments" ici
                __SimpleImageUtilities.throwError(message);
            }
        },

        // appelé par les fonctions orientées utilisateur pour vérifier si la valeur donnée est valide
        rangeCheck: function (value, low, high, funName, coordName, size) {
            if (value < low || value >= high) {
                var message = 'Vous avez essayé d\'appeler ' + funName + ' pour un pixel avec la coordonnée ' + coordName + ' de ' + value +
                              ' dans une image qui ne fait que ' + high + ' pixels ' + size +
                              ' (les coordonnées ' + coordName + ' valides sont de ' + low + ' à ' + (high-1) + ').';
                __SimpleImageUtilities.throwError(message);
            }
        }
    };
})();
