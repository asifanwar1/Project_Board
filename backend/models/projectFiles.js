const mongoose = require('mongoose');

const projectFiles = new mongoose.Schema({
    projectRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    },  
    chunkSize: {
        type: Number,
        default: 255 * 1024
    },   
}, {timestamps: true})

const ProjectFiles = mongoose.model('PROJECTFILES', projectFiles);

module.exports = ProjectFiles;