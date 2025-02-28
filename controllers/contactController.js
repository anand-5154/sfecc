import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const getContactPage = (req, res) => {
    res.render('contact');
};

export const sendEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // Your email address
            subject: `New Contact Message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Redirect with success message
        res.render('contact', {
            success: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Email error:', error);
        res.render('contact', {
            error: 'Failed to send message. Please try again.'
        });
    }
}; 