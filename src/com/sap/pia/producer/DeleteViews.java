package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.SQLTimeoutException;
import java.sql.Statement;
import javax.naming.NamingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeleteViews
{
	private final Logger LOGGER= LoggerFactory.getLogger(DeleteViews.class);
	
	/**
	 * delViews method used to delete attribute, analytic views and analytic privileges.
	 * 
	 * @param appID
	 *            various custom fields sent by client specific to application
	 * @param viewPrefix
	 *            View prefix value
	 * @param viewPackageName
	 *            View package name 
	 * @param connection
	 *            Database connection
	 * @return
	 *         
	 */
	protected void delViews(String appID, String viewPrefix, String viewPackageName, Connection connection)
	{
		PreparedStatement preparedStatementProductName= null;	
		ResultSet rSetProductName= null;
		String queryProductName= "";
		String productName= "";
		String[] viewPrefixArray=null;
		

		// Retrieving productName
		queryProductName= "select PRODUCTNAME from " + "SAP_PIA_USAGECLOUD." + "APPLICATION where ApplicationID= '" + appID + "'";
		try
		{
			preparedStatementProductName= connection.prepareStatement(queryProductName);
			rSetProductName= preparedStatementProductName.executeQuery();
			while(rSetProductName.next())
			{
				productName= rSetProductName.getString("PRODUCTNAME");
			}
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(rSetProductName);
			OdataUtility.safeClose(preparedStatementProductName);
		}

		productName= productName.replaceAll("\\s", "_");
		if (viewPrefix != null) {
			viewPrefixArray= viewPrefix.split(",");
		}
			for(int i= 0; i < viewPrefixArray.length; ++i)
			{
				String[] viewSuffix = viewPrefixArray[i].split(":");
				String viewName = viewSuffix[0]+productName;
				
				procedureToDeleteView(viewName, viewPackageName, viewSuffix[1], "delete", connection);
				procedureToDeleteActivateView(viewName, viewPackageName, viewSuffix[1], "activate", connection);
		}
	}
	
	/**
	 * procedureToDeleteView method used to call Database store procedure and delete the view.
	 * 
	 * @param viewName
	 *            View name
	 * @param packageName
	 *            Full view package name
	 * @param suffixName
	 *            View suffix 
	 * @param actionName
	 *            action name as delete
	 * @param connection
	 *            Database connection
	 * @return
	 *  
	 */
	public void procedureToDeleteView(String viewName, String packageName, String suffixName, String actionName, Connection connection) {
		
		Statement stmt= null;
		String storeProcedure= "";
		storeProcedure = "CALL \"PUBLIC\".\"REPOSITORY_REST\" ('{";
		storeProcedure += "\"action\":\"" +actionName+ "\",";
		storeProcedure += "\"what\": \"objects\", \"session\": {  \"sessionType\": \"2\",   \"workspace\": \"\" }, \"objects\": [ { \"object\": { ";
		storeProcedure +=  "\"package\":\"" +packageName+ "\",";
		storeProcedure += "\"name\":\"" +viewName +"\",";
		storeProcedure += "\"tenant\": \"\",";
		storeProcedure +=  "\"suffix\":\"" +suffixName+"\"";
		storeProcedure += "} } ] } ',?)";
		
		try {
			stmt= connection.createStatement();
			stmt.execute(storeProcedure);
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally {
			OdataUtility.safeClose(stmt);
		}		
	}

	/**
	 * procedureToDeleteView method used to call Database store procedure and delete the view.
	 * 
	 * @param viewName
	 *            View name
	 * @param packageName
	 *            Full view package name
	 * @param suffixName
	 *            View suffix 
	 * @param actionName
	 *            action name as activate
	 * @param connection
	 *            Database connection
	 * @return
	 *  
	 */
public void procedureToDeleteActivateView(String viewName, String packageName, String suffixName, String actionName, Connection connection) {
		
		Statement stmt= null;
		String storeProcedure= "";
		storeProcedure = "CALL \"PUBLIC\".\"REPOSITORY_REST\" ('{";
		storeProcedure += "\"action\":\"" +actionName+ "\",";
		storeProcedure += "\"what\": \"objects\", \"session\": {  \"sessionType\": \"2\",   \"workspace\": \"\" }, \"objList\": [ {  ";
		storeProcedure +=  "\"package\":\"" +packageName+ "\",";
		storeProcedure += "\"name\":\"" +viewName +"\",";
		storeProcedure += "\"tenant\": \"\",";
		storeProcedure +=  "\"suffix\":\"" +suffixName+"\"";
		storeProcedure += "} ], \"activationMode\": \"0\" } ',?)";
		
		try {
			stmt= connection.createStatement();
			stmt.execute(storeProcedure);
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally {
			OdataUtility.safeClose(stmt);
		}		
	}
	
}

