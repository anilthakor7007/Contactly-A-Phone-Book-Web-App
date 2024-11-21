const Contact = require('../models/Contact');

//create contact
exports.createContact = async (req, res) =>{

    const { name, phone, email, city, country } = req.body;

    if ( !name || !phone || !email || !city || !country) {
        return res.status(400).json({ error: 'All fields are required.' });
    }


    try{
        const newContact = new Contact({
            user: req.user.id, // Link contact to the logged-in user
            name,
            email,
            phone,
            city,
            country
          });
      
          const contact = await newContact.save();
          res.status(201).json(contact);   
    }catch(error){
        res.status(500).json({error:error.message});
    }

};

//Get contact
exports.getContacts = async (req, res)=>{

    try{
        const contacts = await Contact.find({ user: req.user.id });
        res.json(contacts);
    }catch(error){
        console.log(error.message);
        res.status(500).json({error:error.message});
    }
}

// Update a contact by ID
exports.updateContact = async (req, res) => {
    const { user, name, email, phone,city, country } = req.body;
  
    // Build contact object
    const contactFields = {};
    if (user) contactFields.user = user;
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (city) contactFields.city = city;
    if (country) contactFields.country = country;
  
    try {
      let contact = await Contact.findById(req.params.id);
  
      if (!contact) return res.status(404).json({ message: "Contact not found" });
  
      // Ensure user owns the contact
      if (contact.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
      }
    
    // Update the contact
    contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { $set: contactFields },
        { new: true }
      );
  
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
    

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
      console.log('Contact ID:', req.params.id);
      console.log('User ID from Token:', req.user.id);
      
      let contact = await Contact.findById(req.params.id);
      
      if (!contact) {
          return res.status(404).json({ message: "Contact not found" });
      }
      
      console.log('Contact Owner ID:', contact.user.toString());
      
      // Ensure the logged-in user owns the contact
      if (contact.user.toString() !== req.user.id) {
          return res.status(401).json({ message: "Not authorized" });
      }
      
      await Contact.findByIdAndDelete(req.params.id);
      
      res.json({ message: "Contact removed" });
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
};
