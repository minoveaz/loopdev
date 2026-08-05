
import os
from loguru import logger
from supabase import Client
from typing import Dict, Any, Optional

class CredentialVault:
    """
    Tier S: Bóveda de Seguridad Industrial.
    Encargada de recuperar y descifrar API Keys de forma transparente.
    Nunca expone claves en texto plano fuera de los conectores de intercambio.
    """
    def __init__(self, supabase: Client):
        self.supabase = supabase
        # La clave secreta debe estar en el entorno del servidor, nunca en el código.
        self.vault_secret = os.getenv("QUANT_VAULT_SECRET", "loopdev-default-vault-secret-2026")
        
        if self.vault_secret == "loopdev-default-vault-secret-2026":
            logger.warning("Vault using default secret. Please set QUANT_VAULT_SECRET in production.")

    async def get_exchange_credentials(self, exchange_account_id: str) -> Optional[Dict[str, str]]:
        """
        Recupera y descifra las claves de un exchange mediante RPC de base de datos.
        """
        try:
            # 1. Obtener los datos cifrados de la cuenta
            res = self.supabase.table("quant_exchanges").select("*").eq("id", exchange_account_id).execute()
            
            if not res.data:
                logger.error(f"Vault: Exchange account {exchange_account_id} not found.")
                return None
            
            acc = res.data[0]
            encrypted_key = acc.get('api_key')
            encrypted_secret = acc.get('api_secret')
            
            if not encrypted_key or not encrypted_secret:
                logger.error(f"Vault: Missing encrypted credentials for account {exchange_account_id}.")
                return None

            # 2. Descifrar mediante funciones PL/pgSQL
            try:
                decrypted_key_res = self.supabase.rpc('decrypt_api_key', {
                    'encrypted_text': encrypted_key,
                    'secret_key': self.vault_secret
                }).execute()
                
                decrypted_secret_res = self.supabase.rpc('decrypt_api_key', {
                    'encrypted_text': encrypted_secret,
                    'secret_key': self.vault_secret
                }).execute()
                
                if not decrypted_key_res.data or not decrypted_secret_res.data:
                    logger.error(f"Vault: Decryption returned empty data. Check if keys in DB are encrypted.")
                    return None

                return {
                    "exchange_id": acc.get('exchange_id') or acc.get('exchange_provider', 'binance'),
                    "api_key": decrypted_key_res.data,
                    "api_secret": decrypted_secret_res.data,
                    "is_paper": acc.get('is_paper', False) # Default a False si no existe la columna
                }
            except Exception as rpc_err:
                logger.error(f"Vault: Decryption failed. The keys in DB might be in plaintext or the secret_key is wrong. Error: {rpc_err}")
                return None

        except Exception as e:
            logger.error(f"Vault: Failed to retrieve credentials: {e}")
            return None

    def encrypt_for_storage(self, plaintext: str) -> str:
        """
        Helper para cifrar claves antes de guardarlas (Uso administrativo).
        """
        res = self.supabase.rpc('encrypt_api_key', {
            'plaintext': plaintext,
            'secret_key': self.vault_secret
        }).execute()
        return res.data
