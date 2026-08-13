console.log("✅ Acceptance bootstrap JS file LOADED");

window.addEventListener("hit:offeringDetail:continue", async function (e) {
  console.log("🟡 Acceptance bootstrap received event", e.detail);

  const { offeringId, amount, priceOptionId } = e.detail;
  if (!offeringId || !amount) return;

  async function getCsrfToken() {
    const res = await fetch("/_layout/tokenhtml", { credentials: "same-origin" });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const input = doc.querySelector("input[name='__RequestVerificationToken']");
    return input && input.value;
  }

  try {
    const token = await getCsrfToken();

    const payload = {
      hit_acceptancestatus: 0,
      hit_baseamount: amount,
      "hit_Offering@odata.bind": `/hit_offerings(${offeringId})`
    };

    if (priceOptionId) {
      payload["hit_PriceOption@odata.bind"] =
        `/hit_priceoptions(${priceOptionId})`;
    }

    console.log("➡️ Creating acceptance", payload);

    const res = await fetch("/_api/hit_offeringacceptances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "__RequestVerificationToken": token,
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
      },
      body: JSON.stringify(payload)
    });

    console.log("⬅️ Acceptance create status:", res.status);

    if (!res.ok) return;

    const entityId =
      res.headers.get("entityid") ||
      res.headers.get("OData-EntityId") ||
      res.headers.get("location");

    const match = entityId && entityId.match(/[0-9a-fA-F-]{36}/);
    if (match) {
      window.location.href = `/accept/?acceptanceid=${match[0]}`;
    }

  } catch (err) {
    console.error("❌ Acceptance bootstrap error", err);
  }
});