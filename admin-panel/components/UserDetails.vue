<template>
  <div v-if="userDetails">
    <h2>User Details</h2>
    <div class="section">
      <p><strong>User ID:</strong> {{ userDetails.user.id }}</p>
      <p><strong>Balance:</strong> {{ userDetails.user.balance }}</p>
    </div>
    <div class="section">
      <h3>Subscription</h3>
      <div v-if="userDetails.subscription">
        <p>
          <strong>Type:</strong>
          {{ userDetails.subscription.subscriptionType.name }}
        </p>
        <p>
          <strong>Write-off date:</strong>
          {{
            new Date(userDetails.subscription.writeOffDate).toLocaleDateString()
          }}
        </p>
        <button class="button" @click="cancelSubscription">
          Cancel Subscription
        </button>
      </div>
      <div v-else>
        <p>No subscription</p>
      </div>
    </div>
    <div class="section">
      <h3>Payment History</h3>
      <ul>
        <li v-for="payment in userDetails.paymentHistory" :key="payment.id">
          {{ new Date(payment.debitingDate).toLocaleString() }}
          {{ payment.subscriptionType }}
        </li>
      </ul>
    </div>
    <div class="section">
      <h3>Points History</h3>
      <ul>
        <li v-for="points in userDetails.pointsHistory" :key="points.id">
          {{ new Date(points.date).toLocaleString() }}
          {{ formatPoints(points.change) }} points ({{ points.type }})
        </li>
      </ul>
    </div>
    <div class="section">
      <h3>Update Points</h3>
      <input type="number" v-model.number="points" />
      <button class="button" @click="updatePoints">Update Points</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["userId"],
  data() {
    return {
      userDetails: null,
      points: 0,
    };
  },
  async created() {
    await this.fetchUserDetails();
  },
  watch: {
    userId: "fetchUserDetails",
  },
  methods: {
    async fetchUserDetails() {
      try {
        const response = await axios.get(
          `${this.$config.public.apiUrl}/api/admin/user-details?user_id=${this.userId}`
        );
        this.userDetails = response.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    async cancelSubscription() {
      try {
        await axios.post(
          `${this.$config.public.apiUrl}/api/admin/cancel-subscription`,
          {
            user_id: this.userId,
          }
        );
        alert("Subscription canceled successfully");
        await this.fetchUserDetails();
        this.$emit("user-updated");
      } catch (error) {
        console.error("Error canceling subscription:", error);
      }
    },
    async updatePoints() {
      if (!this.points) {
        alert("Please enter a valid number of points");
        return;
      }
      try {
        await axios.post(
          `${this.$config.public.apiUrl}/api/admin/update-points`,
          {
            user_id: this.userId,
            points: this.points,
          }
        );
        alert("Points updated successfully");
        await this.fetchUserDetails();
        this.$emit("user-updated");
      } catch (error) {
        console.error("Error updating points:", error);
      }
    },
    formatPoints(points) {
      return Math.sign(points) === 1 ? `+${points}` : points;
    },
  },
};
</script>
