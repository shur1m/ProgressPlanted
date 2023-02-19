const firebase = require("../firebase");
 
const express = require("express");

const router = express.Router();
const db = firebase.database();

/**
 * GET GRAPH gets graph
 * Retrieves graph 
 *
 * @param {str} title title of graph.
 * @return {object} object of the graph.
 */
router.get("/graph", (req, res) => {
    let title = req.query.title;
    const ref = db.ref(`graphs/${title}`);

    ref.once('value', (snap) => {
        if (snap.exists()) {
            res.status(200).json(snap.val());
        } else {
            res.status(200).json("Doc does not exist");
        }
    }, (errorObject) => {
        res.status(400).json({"error": errorObject});
    }); 
})

/**
 * GET DIRECTORY gets directory
 * Retrieves directory 
 *
 */
router.get("/directory", (req,res) => {
    let user = req.query.uid;
    const ref = db.ref(`graphs`);

    ref.once('value', (snap) => {
        if (snap.exists()) {
            res.status(200).json(Object.keys(snap.val()));    
        } else{
            res.status(400).json("Empty Directory");
        }
    }, (errorObject) => {
        res.status(400).json({"error":errorObject});
    });
});


/**
 * POST GRAPH newdoc
 * Creates new doc
 *
 * @param {str}  title title of new graph.
 * @return {JSONObject} object of all the types of C02 usage.
 */
router.post("/newdoc", (req,res)=>{
    let title = req.body.title;
    let ref = db.ref(`graphs/${title}`);
    
    ref.once("value",(snap)=>{
        if (snap.exists()) {
            res.status(200).json({error:"file exists"});
        }
        else {
            db.ref('graphs').update({[title]:{title:title}});
            res.status(200).json("Received");
        }
    })

})

/**
 * POST USER update graph
 * Updates the contents of a graph.
 * 
 * @param {obj}  title  which graph to update.
 * @return {obj} object of all the types of C02 usage.
 */
router.post("/update", (req, res)=> {
    const ref = db.ref(`graphs/${req.body.title}`);
    ref.update(req.body);
    res.status(200).json("Received");
})

module.exports = router;
