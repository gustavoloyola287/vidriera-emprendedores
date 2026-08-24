package ar.com.vidrieraemprendedores.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Recuperación de Contraseña - Vidriera Virtual VCP");
        message.setText("Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:\n\n" 
                + resetLink + "\n\nEste enlace expira en 15 minutos.\n\nSi no solicitaste este cambio, ignora este mensaje.");
        
        mailSender.send(message);
    }
}