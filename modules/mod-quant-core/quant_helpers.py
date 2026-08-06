def from_cents(cents):
    """Convert a cent-denominated value to the display unit."""
    return 0.0 if cents is None else float(cents) / 100.0
