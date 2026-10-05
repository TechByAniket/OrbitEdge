import logging
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from typing import Optional

logger = logging.getLogger(__name__)

class BrowserManager:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self._playwright = None
        self._browser: Optional[Browser] = None
        
    async def start(self) -> BrowserContext:
        """Initialize Playwright and launch the browser."""
        self._playwright = await async_playwright().start()
        
        self._browser = await self._playwright.firefox.launch(
            headless=self.headless,
            args=[
                '--disable-blink-features=AutomationControlled' # Help bypass basic bot detection
            ]
        )
        
        context = await self._browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
            ignore_https_errors=True
        )
        return context
        
    async def stop(self):
        """Close the browser and stop Playwright."""
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
