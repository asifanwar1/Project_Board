const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const multer = require("multer");

const upload = multer({ dest: 'uploads/' });


const User = require('../models/userSchema'); 
const Chat = require('../models/chatSchema'); 
const Project = require('../models/project');
const Phases = require('../models/phases');
const ProjectNotification = require('../models/projectNotification');



module.exports = router.post('/createNewProject', userAuth, upload.array("projectFiles"), async(req, res)=>{
    const {projectTitle, projectDiscription, startDate, dueDate, projectType} = req.body;
    const projectMembers = JSON.parse(req.body.projectMembers);
    const projectDesig = JSON.parse(req.body.projectDesig);
    const projectPhases = JSON.parse(req.body.projectPhases);
    const projectFiles = req.files;
    let allfiles = [];
    let allMembers = [];
    let allPhases = [];
    let singlePhasePercentage = Math.round(100 / projectPhases.length);
    
    projectFiles.map((element)=>{
        let fileObj = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: element.size,
        }
        allfiles.push(fileObj);
    });

    projectDesig.map((element)=>{
        let memberObj = {
            memberRef: element.id,
            designation: element.desg,
           
        }
        allMembers.push(memberObj);
    });
   
    projectPhases.map((element, index)=>{
        let phaseObj = {
            PhaseTitle: element,
            PhaseNum: index + 1,           
        }
        allPhases.push(phaseObj);
    });

    try {
        const data = new Project({  
            projectCreator: req.userID,
            projectTitle: projectTitle,
            projectDiscription: projectDiscription,
            startDate: new Date(startDate),
            dueDate: new Date(dueDate),
            projectType: projectType,
            projectFiles: allfiles,
            members: allMembers,
            projectPhases: allPhases,
            phasePercentage: singlePhasePercentage,
        });

        await data.save();

        res.status(201).send({message: "Project created successfully"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/createProjectChat', userAuth, async(req, res)=>{
    const selectedProjectId = req.body.selectedProjectId;
    const findProject = await Project.findOne({ _id: selectedProjectId });
    const findChat = await Chat.findOne({ projectRef: selectedProjectId });
    let allMembers = [findProject.projectCreator];
    
    findProject.members.map((element)=>{ 
        allMembers.push(element.memberRef);
    });

    try {
        if(findChat){
            res.status(201).send({message: "Chat already exist, Please go to Chat Box."});
        }
        else{
            const projectChat = new Chat({  
                users: allMembers,
                isGroupChat: true,
                groupName: findProject.projectTitle,
                projectRef: findProject._id,
                groupAdmin: findProject.projectCreator,
            });

            await projectChat.save();

            res.status(201).send({message: "Chat Created. Please got to Chat Box."});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.get('/getProjects', userAuth, async(req, res)=>{
    const findProjects = await Project.find({ projectCreator: req.userID });

    try {

        res.status(201).send(findProjects);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/updatingProject', userAuth, upload.array("projectFiles"), async(req, res)=>{
    const {projectTitle, projectDiscription, startDate, dueDate, projectType} = req.body;
    const projectId = JSON.parse(req.body.projectId)
    const projectMembers = JSON.parse(req.body.projectMembers)
    const projectDesig = JSON.parse(req.body.projectDesig)
    const existingFiles = JSON.parse(req.body.existingFiles)
    const projectPhases = JSON.parse(req.body.projectPhases)
    const projectFiles = req.files;
    // console.log(projectFiles.buffer)
    let allfiles = [];
    let allMembers = [];
    let chatMembers = [req.userID];
    let allPhases = [];
    let singlePhasePercentage = Math.round(100 / projectPhases.length);

    if(existingFiles){
        existingFiles.map((element)=>{
            let fileObj = {
            fileName: element.fileName,
            filePath: element.filePath,
            fileType: element.fileType,
            fileSize: element.fileSize,
        }
            allfiles.push(fileObj)
        })
    }

    projectFiles.map((element)=>{
        let fileObj = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: element.size,
        }
        allfiles.push(fileObj)
    })

    projectDesig.map((element)=>{
        let memberObj = {
            memberRef: element.memberRef,
            designation: element.designation,
           
        }
        allMembers.push(memberObj);
        chatMembers.push(element.memberRef);
    })

    projectPhases.map((element, index)=>{
        let phaseObj = {
            PhaseTitle: element.PhaseTitle,
            PhaseNum: index + 1,           
        }
        allPhases.push(phaseObj)
    })

    try {
        const findProject = await Project.updateOne({ _id: projectId },{
            $set: {
                "projectTitle": projectTitle,
                "projectDiscription": projectDiscription,
                "startDate": new Date(startDate),
                "dueDate": new Date(dueDate),
                "projectType": projectType,
                "projectFiles": allfiles,
                "members": allMembers,
                "projectPhases": allPhases,
                "phasePercentage": singlePhasePercentage,
            }
        });

        const findChat = await Chat.updateOne({ projectRef: projectId },{ 
            users: chatMembers,
            groupName: projectTitle,
        });


        
        res.status(201).send({message: "Project updated successfully"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/deleteProject', userAuth, async(req, res)=>{
    const selectedId = req.body.selectedId;

    const deleteSelectedProject = await Project.deleteOne({ _id: selectedId });
    try {
        res.status(201).send({message: "Project deleted"});
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/assignProjectPhases', userAuth, async(req, res)=>{
    const assignedPhases = req.body.assignEachPhase;
    const selectedProjectId = req.body.projectId;
    const findProjectPhases = await Phases.findOne({ projectRef: selectedProjectId });

    try {
        if(findProjectPhases){

            const findProject = await Phases.updateOne({ projectRef: selectedProjectId },{
                $set: {
                    "projectRef": selectedProjectId,
                    "allPhases": assignedPhases,
                }
            });

            res.status(201).send({message: "Phases updated"});
        }
        else{

            const data = new Phases({  
                projectRef: selectedProjectId,
                allPhases: assignedPhases,
            });
    
            await data.save();
    
            res.status(201).send({message: "Phases assigned"});

        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});


module.exports = router.post('/showProjectPhases', userAuth, async(req, res)=>{
    const selectedProjectId = req.body.selectedProjectId;
    const selectedProjectCreator = req.body.selectedProjectCreator;

    const findSelectedProject = await Project.findOne({ _id: selectedProjectId });
    const findProjectPhases = await Phases.findOne({ projectRef: selectedProjectId });
    
    let selectedProjectMembers = [];
    let findProjectCreator;
    
    

    try {
        if(findSelectedProject){

            const currentProjectCreator = await User.findOne({ _id : selectedProjectCreator });
            
            if(currentProjectCreator){
                findProjectCreator = {
                    projectCreatorId: currentProjectCreator._id,
                    projectCreatorName: currentProjectCreator.name,
                    projectCreatorEmail: currentProjectCreator.email,
                    projectCreatorImage: currentProjectCreator.image,
                }
            }

            
            let runMap = findSelectedProject.members.map( async (element)=>{
                let findProjectMember = await User.findOne({ _id : element.memberRef });
                let memberObj = {
                    memberId: findProjectMember._id,
                    memberName: findProjectMember.name,
                    memberEmail: findProjectMember.email,
                    memberDesig: element.designation,
                }
                selectedProjectMembers.push(memberObj);
            })

            await Promise.all(runMap);
            
            res.status(201).send({findProjectPhases, findProjectCreator, selectedProjectMembers});
        }        
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.get('/getAssignedProjects', userAuth, async(req, res)=>{
    const findProjects = await Project.find({ "members.memberRef" : req.userID });
    try {

        res.status(201).send(findProjects);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/phaseCompletedNotification', userAuth, async(req, res)=>{
    const selectedProjectId = req.body.selectedProjectId;
    const selectedPhaseId = req.body.selectedPhase.phaseId;
    const selectedPhaseMember = req.body.selectedPhase.memberRef;
    const selectedPhase = req.body.selectedPhase;

    const findNotification = await ProjectNotification.findOne({ phaseId: selectedPhaseId, memberRef: selectedPhaseMember})
    const findUser = await User.findOne({ _id: selectedPhaseMember })

    try {

        if(findNotification){
            
            res.status(201).send({message: "Notification already sent"});
        }
        else{

            const data = new ProjectNotification({  
                projectRef: selectedProjectId,
                phaseId: selectedPhase.phaseId,
                phaseNum: selectedPhase.phaseNum,
                phaseTitle: selectedPhase.phaseTitle,
                memberRef: selectedPhase.memberRef,
                memberName: selectedPhase.memberName,
                memberImage: findUser.image,
                uniqueId: selectedPhase.uniqueId,
                notificationDate: Date.now(),
            });
    
            await data.save();

            res.status(201).send({message: "Notification sent"});
        }
 
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/getProjectNotifications', userAuth, async(req, res)=>{
    const selectedProjectId = req.body.selectedProjectId;

    const findNotification = await ProjectNotification.find({ projectRef: selectedProjectId })

    try {
        if(findNotification){
            res.status(201).send(findNotification);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/deleteProjectNotifications', userAuth, async(req, res)=>{
    const selectedProjectId = req.body.selectedProjectId;

    const findNotification = await ProjectNotification.deleteMany({ projectRef: selectedProjectId })

    try {
        if(findNotification){
            res.status(201).send({message: "Notifications Deleted"});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/updatePhaseToCompleted', userAuth, async(req, res)=>{
    const selectedphaseForUpdate = req.body.selectedphaseForUpdate;
    const selectedphaseId = selectedphaseForUpdate._id;

    const findPhase = await Project.findOne({ "projectPhases._id" : selectedphaseId })
   
    try {
        if(findPhase){
            findPhase.projectPhases.map((element)=>{
                if(element._id.toString() === selectedphaseId){ 
                    element.PhaseStatus = "Completed";
                }
            })
            findPhase.progressBar = Number(findPhase.progressBar) + Number(findPhase.phasePercentage);

            await findPhase.save();
            res.status(201).send({message: "Phase Updated"});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});




module.exports = router.post('/updatePhaseToPending', userAuth, async(req, res)=>{
    const selectedphaseForUpdate = req.body.selectedphaseForUpdate;
    const selectedphaseId = selectedphaseForUpdate._id;

    const findPhase = await Project.findOne({ "projectPhases._id" : selectedphaseId })
    // console.log(findPhase)
    try {
        if(findPhase){
            findPhase.projectPhases.map((element)=>{
                if(element._id.toString() === selectedphaseId){
                    element.PhaseStatus = "Pending";
                }
            });
            findPhase.progressBar = Number(findPhase.progressBar) - Number(findPhase.phasePercentage);

            await findPhase.save();
            res.status(201).send({message: "Phase Updated"});
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});





module.exports = router.get('/downloadFile/:id', userAuth, async(req, res)=>{
    const fileId = req.params.id;
    const findProject = await Project.findOne({ "projectFiles._id" : fileId });
    let selectedfile = null;
    try {
        if(findProject){
            let runMap = findProject.projectFiles.map((element)=>{
                if(element._id.toString() === fileId){
                    selectedfile = element;
                }
            })

            await Promise.all(runMap);

            const filePath = selectedfile.filePath;
            const fileName = selectedfile.fileName;

            res.set("Content-Type", selectedfile.fileType);
            res.set("Content-Disposition", `attachment; filename=${fileName}`);
            res.download(filePath, fileName);
        }
        
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});