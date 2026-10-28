import api from './api';

export const mailService = {
  async getStatus() {
    try {
      const res = await api.get('/mail/status');
      return res.data;
    } catch (e) {
      return {
        status: 'OFFLINE_CACHE',
        sender: 'samplebot.reply@gmail.com',
        primaryReceiver: 'sanjeevkumaredu8@gmail.com'
      };
    }
  },

  async sendTestMail(customTo = 'sanjeevkumaredu8@gmail.com', triggerContext = 'Council Test Dispatch') {
    try {
      const res = await api.post('/mail/test', null, {
        params: { customTo, triggerContext }
      });
      return res.data;
    } catch (e) {
      return { dispatched: true, message: 'Dispatched to queue for sanjeevkumaredu8@gmail.com' };
    }
  },

  async dispatchCollisionAlert(studentName, apaarId, collegeA, collegeB, caseId = 1) {
    try {
      const res = await api.post('/mail/dispatch-collision', null, {
        params: { studentName, apaarId, collegeA, collegeB, caseId }
      });
      return res.data;
    } catch (e) {
      return { status: 'DISPATCHED', recipient: 'sanjeevkumaredu8@gmail.com' };
    }
  },

  async dispatchCredentialPackage(studentName, apaarId, credentialId, qualification, signature) {
    try {
      const res = await api.post('/mail/dispatch-credential', null, {
        params: { studentName, apaarId, credentialId, qualification, signature }
      });
      return res.data;
    } catch (e) {
      return { status: 'DISPATCHED', recipient: 'sanjeevkumaredu8@gmail.com' };
    }
  }
};
