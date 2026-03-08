"""API client for VEYOR backend services."""
import requests
from typing import Dict, Any, Optional
from config import config


class VEYORAPIClient:
    """Client for interacting with VEYOR backend API."""

    def __init__(self, base_url: str = None, api_key: str = None):
        self.base_url = base_url or config.VEYOR_api.base_url
        self.api_key = api_key or config.VEYOR_api.api_key
        self.timeout = config.VEYOR_api.timeout
        self.session = requests.Session()
        
        if self.api_key:
            self.session.headers.update({"Authorization": f"Bearer {self.api_key}"})

    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to the API."""
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e), "status_code": getattr(e.response, 'status_code', None)}

    # Booking endpoints
    def get_booking(self, booking_id: int) -> Dict[str, Any]:
        """Get booking details by ID."""
        return self._make_request("GET", f"/bookings/{booking_id}")

    def list_bookings(self, user_id: Optional[int] = None, status: Optional[str] = None) -> Dict[str, Any]:
        """List bookings with optional filters."""
        params = {}
        if user_id:
            params["userId"] = user_id
        if status:
            params["status"] = status
        return self._make_request("GET", "/bookings", params=params)

    # Shipment endpoints
    def get_shipment(self, shipment_id: int) -> Dict[str, Any]:
        """Get shipment details by ID."""
        return self._make_request("GET", f"/shipments/{shipment_id}")

    def get_shipment_tracking(self, shipment_id: int) -> Dict[str, Any]:
        """Get tracking events for a shipment."""
        return self._make_request("GET", f"/shipments/{shipment_id}/tracking")

    def get_shipment_by_tracking_number(self, tracking_number: str) -> Dict[str, Any]:
        """Get shipment details by tracking number."""
        return self._make_request("GET", f"/shipments/tracking/{tracking_number}")

    def get_shipment_documents(self, shipment_id: int) -> Dict[str, Any]:
        """Get documents associated with a shipment."""
        return self._make_request("GET", f"/shipments/{shipment_id}/documents")

    # Quote endpoints
    def search_quotes(self, search_params: Dict[str, Any]) -> Dict[str, Any]:
        """Search for quotes based on route and cargo details."""
        return self._make_request("POST", "/quotes/search", data=search_params)

    def get_quote_breakdown(self, quote_id: str) -> Dict[str, Any]:
        """Get detailed cost breakdown for a quote."""
        return self._make_request("GET", f"/quotes/{quote_id}/breakdown")

    # Finance endpoints
    def get_invoice(self, invoice_id: int) -> Dict[str, Any]:
        """Get invoice details."""
        return self._make_request("GET", f"/finance/invoices/{invoice_id}")

    def list_invoices(self, booking_id: Optional[int] = None) -> Dict[str, Any]:
        """List invoices with optional booking filter."""
        params = {}
        if booking_id:
            params["bookingId"] = booking_id
        return self._make_request("GET", "/finance/invoices", params=params)

    # Catalog endpoints
    def search_locations(self, query: str) -> Dict[str, Any]:
        """Search for locations by name or code."""
        return self._make_request("GET", "/catalog/locations", params={"q": query})

    def get_commodity(self, hs_code: str) -> Dict[str, Any]:
        """Get commodity details by HS code."""
        return self._make_request("GET", f"/catalog/commodities/{hs_code}")


# Global client instance
api_client = VEYORAPIClient()
