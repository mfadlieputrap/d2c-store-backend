import {jest} from "@jest/globals";

const findOne = jest.fn();
const create = jest.fn();
const findByIdAndUpdate = jest.fn();
const findById = jest.fn();

export default {findOne, create, findById, findByIdAndUpdate};