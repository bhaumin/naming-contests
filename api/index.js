import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import config from '../config';

let dbName = 'test';
let mdb;

MongoClient.connect(config.mongodbUri, {useUnifiedTopology: true})
  .then(client => {
    mdb = client.db(dbName);
  })
  .catch(console.error);

const router = express.Router();


router.get('/contests', (req, res) => {
  mdb.collection('contests')
    .find({})
    .project({
      categoryName: 1,
      contestName: 1
    })
    .toArray()
    .then(docs => {
      const contests = docs.reduce((obj, contest) => {
        obj[contest._id] = contest;
        return obj;
      }, {});

      res.send({ contests });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/contests/:contestId', (req, res) => {
  mdb.collection('contests')
    .findOne({ _id: ObjectID(req.params.contestId) })
    .then(contest => {
      res.send(contest);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(ObjectID);
  mdb.collection('names')
    .find({ _id: { $in: nameIds } })
    .toArray()
    .then(docs => {
      const names = docs.reduce((obj, name) => {
        obj[name._id] = name;
        return obj;
      }, {});

      res.send({ names });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.post('/names', (req, res) => {
  const contestId = ObjectID(req.body.contestId);
  const name = req.body.newName.trim();

  if (name === '') {
    res.status(400).send('Bad Request - newName is empty');
  }

  mdb.collection('names')
    .insertOne({ name })
    .then(result => {
      mdb.collection('contests')
        .findOneAndUpdate(
          { _id: contestId },
          { $push: { nameIds: result.insertedId } },
          { returnOriginal: false })
        .then(doc => {
          if (!doc.value) {
            res.status(400).send('Bad Request - invalid contestId');
          }
          res.send({
            updatedContest: doc.value,
            newName: { _id: result.insertedId, name }
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

export default router;
