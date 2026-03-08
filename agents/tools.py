"""LangChain tools for VEYOR agents."""
import json
from typing import Dict, Any
from langchain_core.tools import tool
from api_client import api_client


@tool
def get_booking_status(booking_id: str) -> str:
    """
    Get the current status and details of a booking by ID. Use this when the customer asks about their booking status, price, or contact information.
    
    Args:
        booking_id: The ID of the booking to retrieve
        
    Returns:
        JSON string with booking details including status, price, and contact info
    """
    try:
        booking_id_int = int(booking_id)
        result = api_client.get_booking(booking_id_int)
        
        if "error" in result:
            return f"Error retrieving booking: {result['error']}"
        
        return json.dumps(result, indent=2)
    except ValueError:
        return f"Invalid booking ID: {booking_id}. Must be a number."


@tool
def get_shipment_tracking(shipment_id_or_tracking: str) -> str:
    """
    Get real-time tracking events for a shipment by ID or tracking number. Use this when the customer asks 'where is my shipment' or provides a tracking number like 'TRK-1765280261369'.
    
    Args:
        shipment_id_or_tracking: The ID or tracking number of the shipment (e.g., '5' or 'TRK-1765280261369')
        
    Returns:
        JSON string with tracking events including status, location, and timestamps
    """
    # Check if it's a tracking number (starts with TRK-)
    if shipment_id_or_tracking.startswith('TRK-'):
        result = api_client.get_shipment_by_tracking_number(shipment_id_or_tracking)
        if "error" in result:
            return f"Error retrieving shipment: {result['error']}"
        return json.dumps(result, indent=2)
    
    # Otherwise treat as numeric ID
    try:
        shipment_id_int = int(shipment_id_or_tracking)
        result = api_client.get_shipment_tracking(shipment_id_int)
        
        if "error" in result:
            return f"Error retrieving tracking: {result['error']}"
        
        return json.dumps(result, indent=2)
    except ValueError:
        return f"Invalid shipment identifier: {shipment_id_or_tracking}. Must be a number or tracking number like 'TRK-123'."


@tool
def explain_quote_breakdown(quote_id: str) -> str:
    """
    Get detailed cost breakdown for a quote including all surcharges. Use this when the customer asks about pricing details or wants to understand surcharges like BAF, CAF, PSS, or OWS.
    
    Args:
        quote_id: The ID of the quote to explain
        
    Returns:
        JSON string with detailed cost breakdown including base price and all surcharges
    """
    try:
        quote_id_int = int(quote_id)
        result = api_client.get_quote_breakdown(quote_id_int)
        
        if "error" in result:
            return f"Error retrieving quote: {result['error']}"
        
        return json.dumps(result, indent=2)
    except ValueError:
        return f"Invalid quote ID: {quote_id}. Must be a number."


@tool
def get_invoice_details(invoice_id: str) -> str:
    """
    Get invoice details including line items and payment status. Use this when the customer asks about their invoice or billing.
    
    Args:
        invoice_id: The ID of the invoice to retrieve
        
    Returns:
        JSON string with invoice details including line items and payment status
    """
    try:
        invoice_id_int = int(invoice_id)
        result = api_client.get_invoice(invoice_id_int)
        
        if "error" in result:
            return f"Error retrieving invoice: {result['error']}"
        
        return json.dumps(result, indent=2)
    except ValueError:
        return f"Invalid invoice ID: {invoice_id}. Must be a number."


@tool
def search_locations(location_query: str) -> str:
    """
    Search for port and location information by name or code. Use this when the customer asks about a specific location, port, or wants to know port codes.
    
    Args:
        location_query: Location name or code (e.g., "Shanghai" or "CNSHA")
        
    Returns:
        JSON string with matching locations
    """
    result = api_client.search_locations(location_query)
    
    if "error" in result:
        return f"Error searching locations: {result['error']}"
    
    return json.dumps(result, indent=2)


# Define customer support tools list
customer_support_tools = [
    get_booking_status,
    get_shipment_tracking,
    explain_quote_breakdown,
    get_invoice_details,
    search_locations
]
