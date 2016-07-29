var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
    var item = this.items.splice(id, 1);
    this.id -= 1;
    for (var i = id; i < this.items.length; i++) {
        this.items[i].id = i;
    }
    return item[0].name;
};

Storage.prototype.edit = function(id, name) {
    if (id > this.id) {
        return this.add(name);
    }
    this.items[id].name = name;
    return this.items[id];
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id/', function(req, res) {
    var id = req.params.id;
    
    if (id > storage.items.length - 1) {
        return res.sendStatus(400);
    }
    
    var item = storage.delete(id);
    res.status(201).json(item);
});

app.put('/items/:id/', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    
    var id = req.params.id;
    var item = storage.edit(id, req.body.name);
    res.status(201).json(item);
});

app.listen(process.env.PORT || 8080);