const app = require('express').Router();
const { User } = require('../../models')



//Create a new User
app.post('/', ({ body }, res) => {
    User.create(body)
        .then(dbUser => {
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});


//Get all Users
app.get('/', (req, res) => {
    User.find()
        .then(dbUserData => {
            console.log(dbUserData)
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err);
        });
});


//GET/PUT/DELETE USER ROUTES
//Get a single user by ID
app.get('/:id', ({ params }, res) => {
    User.findOne({ _id: params.id })
    .select('-__v')
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No data found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err)
    })
})

//Update a user
app.put('/:id', ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, { runValidators: true, new: true })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

})

//Delete a user using findOneAndDelete method
app.delete('/:id', ({ params }, res) => {
    User.findOneAndDelete({ _id: params.id }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

//ADD FRIEND/REMOVE FRIEND ROUTES

//Add a friend using id/friends/friendid
app.post('/:id/friends/:friendId', ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
      )
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id. '});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
})

//Delete a friend 
app.delete('/:id/friends/:friendId', ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
})

module.exports = app