package com.sentinel.ledger.controller;

import com.sentinel.ledger.service.MailDispensaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Project Sentinel-Ledger • Drishyam Mesh
 * Mail Dispensary REST Controller
 */
@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private MailDispensaryService mailDispensaryService;

    @Value("${app.mail.sender:samplebot.reply@gmail.com}")
    private String senderEmail;

    @Value("${app.mail.receiver:sanjeevkumaredu8@gmail.com}")
    private String receiverEmail;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getMailStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("gateway", "AICTE Automated Mail Dispensary");
        status.put("sender", senderEmail);
        status.put("primaryReceiver", receiverEmail);
        status.put("protocol", "SMTP/TLS (Port 587)");
        status.put("status", "ACTIVE_DISPATCHER");
        status.put("lastPing", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestMail(
            @RequestParam(required = false) String customTo,
            @RequestParam(required = false, defaultValue = "Manual Council Test Trigger") String triggerContext) {

        String recipient = (customTo != null && !customTo.isBlank()) ? customTo : receiverEmail;
        String subject = "Drishyam Mesh • Automated Mail Dispensary Health Check [" + triggerContext + "]";
        String body = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px;'>"
                + "<h2 style='color: #4338ca;'>AICTE Mail Dispensary Status: Operational</h2>"
                + "<p>This email verifies that the automated notification gateway is actively linked to the Drishyam Mesh Governance Grid.</p>"
                + "<p><strong>Trigger Source:</strong> " + triggerContext + "<br>"
                + "<strong>Dispatch Time:</strong> " + LocalDateTime.now() + "</p>"
                + "<div style='padding: 10px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; color: #166534; font-size: 13px;'>"
                + "All collision disputes, APH quota breaches, and W3C Verifiable Credential releases will be routed to this address."
                + "</div></div>";

        mailDispensaryService.sendMailAsync(recipient, subject, body);

        Map<String, Object> resp = new HashMap<>();
        resp.put("dispatched", true);
        resp.put("recipient", recipient);
        resp.put("timestamp", LocalDateTime.now().toString());
        resp.put("message", "Email successfully enqueued in Mail Dispensary for immediate dispatch.");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/dispatch-collision")
    public ResponseEntity<Map<String, Object>> dispatchCollision(
            @RequestParam(defaultValue = "Devansh Gupta") String studentName,
            @RequestParam(defaultValue = "9082-3145-6671") String apaarId,
            @RequestParam(defaultValue = "Delhi Technological University (DTU)") String collegeA,
            @RequestParam(defaultValue = "COEP Technological University Pune") String collegeB,
            @RequestParam(defaultValue = "1") Long caseId) {

        mailDispensaryService.sendCollisionDisputeAlert(studentName, apaarId, collegeA, collegeB, caseId);

        Map<String, Object> resp = new HashMap<>();
        resp.put("alertType", "COLLISION_DISPUTE");
        resp.put("caseId", caseId);
        resp.put("recipient", receiverEmail);
        resp.put("status", "DISPATCHED");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/dispatch-credential")
    public ResponseEntity<Map<String, Object>> dispatchCredential(
            @RequestParam(defaultValue = "Devansh Gupta") String studentName,
            @RequestParam(defaultValue = "9082-3145-6671") String apaarId,
            @RequestParam(defaultValue = "AICTE-CRED-1B80D166") String credentialId,
            @RequestParam(defaultValue = "Bachelor of Technology in Computer Science and Engineering") String qualification,
            @RequestParam(defaultValue = "0x7c9e13d80a91f5432b0129a8f2d91c4b72183e91024bc6719ef8a20391d842b") String signature) {

        mailDispensaryService.sendVerifiableCredentialPackage(studentName, apaarId, credentialId, qualification, signature);

        Map<String, Object> resp = new HashMap<>();
        resp.put("alertType", "VERIFIABLE_CREDENTIAL_ISSUED");
        resp.put("credentialId", credentialId);
        resp.put("recipient", receiverEmail);
        resp.put("status", "DISPATCHED");
        return ResponseEntity.ok(resp);
    }
}
