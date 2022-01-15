const User = require("../db/model/User");
const Course = require("../db/model/Course");
const TutorCourse = require("../db/model/TutorCourse");
const search = require("../utils/search");
// const auth = require("../auth/check-auth");
const { Sequelize } = require("sequelize");
const jwtdecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const Op = Sequelize.Op;

//****************** Get All Courses of All Tutors *******************
const getAllCourses = async(req,res) => {
/*
    const tutorCourses = await TutorCourse.findAll({
        where: search(req.query.search, "CourseId"),
        include: [Course]
    });

    res.json({
        success: true,
        message: "List of all Courses",
        records: tutorCourses.length,
        data: tutorCourses,
    });
*/
    res.json({
        success: true,
        message: "List of all Courses",
    });

};

//****************** Get All Courses of Requested Tutor ONLY **************
exports.getAllCourses = getAllCourses;

const getTutorCourses = async(req, res) => {

    res.json({
        success: true,
        message: "List of all Tutor Courses",
        //records: courses.length,
        //data: courses,
    });
};

exports.getTutorCourses = getTutorCourses;

//************* Create New Tutor's Course ***************

const postTutorCourse = async(req,res) => {

    var courseId = 0;

    const existingCourse = await Course.findOne({
        //where: search(req.query.search, "id"),
        where: search(req.body.name, "name"),
    });

    if (existingCourse){
        courseId = existingCourse.id;
/*
        res.json({
            success: true,
            message: "Course exists",
            records: existingCourse.length,
            data: existingCourse,
        });
*/
    }
    else {
        let course = Course.build({
            name: req.body.name,
            // Since we do not have a description, putting the name of the course in the description
            description: req.body.name,
        });

        await course.save().catch((e) => {
            console.log(e);
        });

        courseId = course.id;
    }
    var token = req.headers.authorization.split(" ")[2]; // Bearer Token

    const decodedToken = jwt.verify(token, "privatekey");
    const UserID = decodedToken.id;
/*
    res.json({
        success: true,
        message: "Test",
        data: "courseId: " + courseId,
    });
*/
    let tutorCourse = TutorCourse.build({
        UserId: UserID,
        CourseId: courseId,
        coursePricePerHour: req.body.coursePricePerHour,
        isFull: 0
    });
/*
    res.json({
        success: true,
        message: "Test",
        data: tutorCourse,
    });
*/
    await tutorCourse.save().catch((e) => {
        console.log(e);
    });

    res.json({
        success: true,
        message: "Tutor Course " + req.body.name + " Created",
        records: tutorCourse.length,
        data: tutorCourse,
    });
};

exports.postTutorCourse = postTutorCourse;

//************* Update Existing Tutor's Course ***************
const updateTutorCourse = async (req, res) => {
    res.json({
        success: true,
        message: "Tutor's Course successfully updated",
        //message: "Course '" + course.name + "' successfully updated",
        //records: course.length,
    });
};
exports.updateTutorCourse = updateTutorCourse;

//************* Delete Existing Tutor's Course ***************

const deleteTutorCourse = async (req, res) => {
    res.json({
        success: true,
        message: "Tutor's Course successfully deleted",
        //message: "Course '" + course.name + "' successfully deleted",
        //records: course.length,
    });
}

exports.deleteTutorCourse = deleteTutorCourse;