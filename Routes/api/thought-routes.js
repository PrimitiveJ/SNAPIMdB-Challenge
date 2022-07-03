const app = require('express').Router();
const { Thought, User } = require('../../models')

//create a new thought
app.post('/', ({ body }, res) => {
    Thought.create(body)
        .then(({ _id }) =>
            User.findOneAndUpdate({}, { $push: { thoughts: _id } }, { new: true })
        )
        .then(dbUser => {
            res.json(dbUser);
        })
});

//Get all Thoughts
app.get('/', (req, res) => {
    Thought.find()
     .select('-__v')
     .sort('-createdAt')
    .then(dbThoughtData => {
        console.log(dbThoughtData);
        res.json(dbThoughtData)
    })
});


//Get a single thought by ID
app.get('/:id', ({ params }, res) => {
    Thought.findOne({_id: params.id})
    .select('-__v')
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No data found with this id'});
            return;
        }
        res.json(dbThoughtData);
    })
});

//Update a thought
app.put('/:id', ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.id }, body, { runValidators: true, new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thoughts with this id!' });
            }
            res.json(dbThoughtData);
        })
});

//Delete a thought
app.delete('/:userId/:thoughtId', ({ params }, res) => {
    Thought.findOneAndDelete(
        { _id: params.thoughtId },
        { new: true, runValidators: true })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            res.status(404).json({
              message: "No user found with this id!",
            });
            User.findOneAndUpdate(
              { thoughts: params.thoughtId },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            )
          }
          
        }).then(res.json("thought deleted"))
    });

//Create a reaction using findOneAndUpdate method with ID/reactions as body and new:true
app.post('/:id', ({ params, body }, res) => {
    Thought.findOneAndUpdate
    (
      { _id: params.id },
      { $push: { reactions: body } },
      { new: true }
    )
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(400).json({ message: 'No thought found with this id.' });
        return;
      }
      res.json(dbThoughtData);
    })
  });

// DELETE REACTIONS TO THOUGHTS

app.delete('/:userId/:thoughtId/:reactionId', ({ params }, res) => {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId},
        { $pull: { reactions: { reactionId: params.reaction}}},
        { new: true }
    )
    .select('-__v')
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(400).json({ message: 'No reaction/thought found with this/these id(s).'
        });
        return;
    }
        res.json(dbThoughtData)
    })
});

module.exports = app

