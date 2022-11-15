from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import SeleniumUtilities as selUtil
import time

## LOCATION OF WEB DRIVER
PATH = "C:\\Users\\Nolan Schneider\\Downloads\\chromedriver_win32 (1)\chromedriver"
URL = "https://stepheng.dev"

#   Tests joining a collaborive document by the 
#   document id and the document password
def joinDocument():
    ## TEST document access information ##
    id: int = 10
    password: str = "test"
    
    ## ELEMENT NAMES ##
    documentID: str = "mat-input-0"
    buttonClass: str = "button-container"
    documentPasswordelement = "mat-input-4"
    
   ## TEST JOINING DOCUMENT ##
    selUtil.openBrowswer()
    driver = selUtil.getWebDriver()
    selUtil.openSite(URL)
    time.sleep(3)
    elementDocumentId = driver.find_element(By.ID, documentID)
    elementDocumentId.send_keys(id)
    elementButton = driver.find_element(By.CLASS_NAME, buttonClass)
    elementButton.click()
    time.sleep(3)
    elementDocumentPassword = driver.find_element(By.ID, documentPasswordelement)
    elementDocumentPassword.send_keys(password)
    elementButton = driver.find_element(By.CLASS_NAME, buttonClass)
    elementButton.click()
    time.sleep(5)
   

# Test creating a collaboritive document
def createDocument():
    fileNameElement = "mat-input-1"
    fileTypeElement = ""
    passwordElement = "mat-input-2"

    selUtil.openBrowswer()
    driver = selUtil.getWebDriver()
    selUtil.openSite(URL)
    time.sleep(3)
    elementFileName = driver.find_element(By.ID, fileNameElement)
    elementFileName.send_keys("TestDocument")
    time.sleep(3)

    select = driver.find_element(By.ID,"mat-select-0")
    select.click()
    selectValue = driver.find_element(By.ID,"mat-option-0")
    selectValue.click()
    time.sleep(3)
   
    elementPassword = driver.find_element(By.ID, passwordElement)
    elementPassword.send_keys("Password")
    time.sleep(3)

    elementSubmit = driver.find_element(By.CLASS_NAME,"submit-button")
    elementSubmit.click()
    
    # Test adding text to a document
def typeToDocument():
    joinDocument()
    driver = selUtil.getWebDriver()
    editor = driver.find_element(By.ID, "container")
    editor.send_keys("System.out.println("'Hello world'");")
    
    
#How it works page
def howItWorks():
    joinDocument()
    driver = selUtil.getWebDriver()
    link = driver.find_element(By.LINK_TEXT, "How It Works")
    link.click()
    
#Home page
def homePage():
    joinDocument()
    driver = selUtil.getWebDriver()
    link = driver.find_element(By.LINK_TEXT, "Home")
    link.click()

#Home page
def githubPage():
    joinDocument()
    driver = selUtil.getWebDriver()
    link = driver.find_element(By.LINK_TEXT, "Github")
    link.click()
    
# Test downloanding a document
def downloadDocument():
    joinDocument()
    driver = selUtil.getWebDriver()
    download = driver.find_element(By.ID, "download")
    download.click()

createDocument()
