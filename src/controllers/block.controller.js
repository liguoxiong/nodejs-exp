import { BlockModel } from "../models";
import v from "voca";

const createBlock = async (req, res) => {
  const {
    body: { name, address, description, location, },
    user
  } = req;
  try {
    const slug = v.slugify(name);
    const [numberAndStreet, ward, district, province] = address.split(", ");
    const [number, ...street] = numberAndStreet.split(" ");
    const block = new BlockModel({
      name,
      slug,
      address: {
        addressFormated: address,
        province,
        district,
        ward,
        street: street.join(" "),
        number,
        location,
      },
      description,
      price,
      user: user._id
    });
    await block.save();
    res.status(201).json({
      success: true,
      message: "Create Block successfull"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getAllBlock = async (req, res) => {
  const { user } = req;
  try {
    const blocks = await BlockModel.find({ user: user._id });
    res.status(200).json({
      success: true,
      blocks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default { createBlock, getAllBlock };
