package com.sentinel.ledger.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

/**
 * Project Sentinel-Ledger • Drishyam Mesh
 * Automated Mail Dispensary Service for AICTE National Governance Grid
 * Dispatches critical incident alerts, collision dispute notices, intake drift warnings,
 * and W3C Verifiable Credential receipts.
 */
@Service
public class MailDispensaryService {

    private static final Logger log = LoggerFactory.getLogger(MailDispensaryService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.sender:samplebot.reply@gmail.com}")
    private String senderEmail;

    @Value("${app.mail.receiver:sanjeevkumaredu8@gmail.com}")
    private String primaryReceiverEmail;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    /**
     * Dispatches an automated incident report when a cross-institution collision is detected.
     */
    public CompletableFuture<Boolean> sendCollisionDisputeAlert(
            String studentName,
            String apaarId,
            String collegeA,
            String collegeB,
            Long caseId) {

        String subject = "URGENT: Cross-Institution Admission Collision Flagged [Case #" + caseId + "]";
        String content = buildCollisionEmailBody(studentName, apaarId, collegeA, collegeB, caseId);

        return sendMailAsync(primaryReceiverEmail, subject, content);
    }

    /**
     * Dispatches an alert when institutional intake quota or supernumerary cap is breached.
     */
    public CompletableFuture<Boolean> sendIntakeQuotaAlert(
            String institution,
            String program,
            int enrolled,
            int capacity) {

        String subject = "AICTE Quota Drift Alert: Sanctioned Capacity Exceeded at " + institution;
        String content = buildQuotaEmailBody(institution, program, enrolled, capacity);

        return sendMailAsync(primaryReceiverEmail, subject, content);
    }

    /**
     * Dispatches a Verifiable Credential package to student and council audit inbox.
     */
    public CompletableFuture<Boolean> sendVerifiableCredentialPackage(
            String studentName,
            String apaarId,
            String credentialId,
            String qualification,
            String ed25519Signature) {

        String subject = "W3C Verifiable Credential Issued • " + qualification + " [" + credentialId + "]";
        String content = buildCredentialEmailBody(studentName, apaarId, credentialId, qualification, ed25519Signature);

        return sendMailAsync(primaryReceiverEmail, subject, content);
    }

    /**
     * Core asynchronous mail dispatcher.
     */
    public CompletableFuture<Boolean> sendMailAsync(String to, String subject, String bodyHtml) {
        return CompletableFuture.supplyAsync(() -> {
            if (!mailEnabled || mailSender == null) {
                log.warn("Mail dispensary disabled or JavaMailSender not configured. Email to {} skipped.", to);
                return false;
            }

            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(senderEmail, "Drishyam Mesh Regulatory Dispatcher");
                helper.setTo(to != null && !to.isBlank() ? to : primaryReceiverEmail);
                helper.setSubject(subject);
                helper.setText(bodyHtml, true);

                mailSender.send(message);
                log.info("Automated Mail Dispensary successfully dispatched email to: {} with subject: {}", to, subject);
                return true;
            } catch (Exception e) {
                log.error("Failed to dispatch email via Mail Dispensary to {}: {}", to, e.getMessage());
                return false;
            }
        });
    }

    private String buildCollisionEmailBody(String student, String apaar, String collegeA, String collegeB, Long caseId) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm:ss"));
        return "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;'>"
                + "<div style='border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 20px;'>"
                + "<h2 style='color: #b91c1c; margin: 0;'>AICTE Regulatory Incident Notification</h2>"
                + "<p style='color: #64748b; font-size: 13px; margin: 4px 0 0 0;'>Drishyam Mesh • Multi-Institution Collision Interceptor</p>"
                + "</div>"
                + "<p style='font-size: 14px; color: #1e293b; line-height: 1.6;'>"
                + "A concurrent multi-institution seat claim has been detected by the <strong>Neo4j Knowledge Mesh & Private Set Intersection (PSI)</strong> pipeline."
                + "</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px;'>"
                + "<tr style='background: #f8fafc;'><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Dispute Case ID</td><td style='padding: 10px; border: 1px solid #e2e8f0; color: #7c3aed; font-weight: bold;'>CASE-" + caseId + "</td></tr>"
                + "<tr><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Candidate Name</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>" + student + "</td></tr>"
                + "<tr style='background: #f8fafc;'><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>National APAAR ID</td><td style='padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;'>" + apaar + "</td></tr>"
                + "<tr><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Institution Claim 1</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>" + collegeA + "</td></tr>"
                + "<tr style='background: #f8fafc;'><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Institution Claim 2</td><td style='padding: 10px; border: 1px solid #e2e8f0; color: #b91c1c; font-weight: bold;'>" + collegeB + "</td></tr>"
                + "<tr><td style='padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;'>Detection Timestamp</td><td style='padding: 10px; border: 1px solid #e2e8f0;'>" + timestamp + "</td></tr>"
                + "</table>"
                + "<div style='background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; font-size: 12px; color: #991b1b;'>"
                + "<strong>Action Required:</strong> Both institutional registrar accounts have been notified. The secondary seat allocation has been quarantined in the Sandboxed Diff Chamber awaiting arbitration."
                + "</div>"
                + "<p style='font-size: 11px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 10px;'>"
                + "This is an automated dispatch from the Drishyam Mesh Sentinel Ledger Node. Do not reply to this email."
                + "</p>"
                + "</div>";
    }

    private String buildQuotaEmailBody(String institution, String program, int enrolled, int capacity) {
        return "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;'>"
                + "<div style='border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;'>"
                + "<h2 style='color: #b45309; margin: 0;'>AICTE Intake Drift Circuit Breaker Alert</h2>"
                + "<p style='color: #64748b; font-size: 13px; margin: 4px 0 0 0;'>Drishyam Mesh • Approval Process Handbook (APH) Monitor</p>"
                + "</div>"
                + "<p style='font-size: 14px; color: #1e293b; line-height: 1.6;'>"
                + "Program intake utilization has exceeded statutory sanctioned limits at <strong>" + institution + "</strong>."
                + "</p>"
                + "<p style='font-size: 13px;'>Program: <strong>" + program + "</strong><br>"
                + "Current Active Enrollment: <strong style='color: #b45309;'>" + enrolled + "</strong> / Sanctioned Ceiling: <strong>" + capacity + "</strong></p>"
                + "<div style='background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0; font-size: 12px; color: #92400e;'>"
                + "Further batch commitments for this program are temporarily held in the Sandboxed Diff Chamber until quota revalidation."
                + "</div>"
                + "</div>";
    }

    private String buildCredentialEmailBody(String student, String apaar, String credId, String qual, String sig) {
        return "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;'>"
                + "<div style='border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;'>"
                + "<h2 style='color: #047857; margin: 0;'>Official AICTE Academic Credential Issued</h2>"
                + "<p style='color: #64748b; font-size: 13px; margin: 4px 0 0 0;'>W3C Verifiable Credential & Offline Cryptographic Anchor</p>"
                + "</div>"
                + "<p style='font-size: 14px; color: #1e293b; line-height: 1.6;'>"
                + "Congratulations, an authentic verifiable academic degree has been sealed into the national ledger for <strong>" + student + "</strong>."
                + "</p>"
                + "<table style='width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px;'>"
                + "<tr><td style='padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;'>Credential ID</td><td style='padding: 8px; border: 1px solid #e2e8f0; font-mono: monospace; color: #7c3aed; font-weight: bold;'>" + credId + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;'>APAAR ID</td><td style='padding: 8px; border: 1px solid #e2e8f0;'>" + apaar + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;'>Awarded Qualification</td><td style='padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;'>" + qual + "</td></tr>"
                + "<tr><td style='padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;'>Ed25519 Signature</td><td style='padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 11px;'>" + sig.substring(0, Math.min(sig.length(), 32)) + "...</td></tr>"
                + "</table>"
                + "<div style='background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin: 15px 0; font-size: 12px; color: #065f46;'>"
                + "This credential includes offline cryptographic QR verification. Employers and verifiers can authenticate this claim without database access."
                + "</div>"
                + "</div>";
    }
}
