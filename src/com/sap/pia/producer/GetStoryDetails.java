package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GetStoryDetails
{

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(GetStoryDetails.class);
	
	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;
	private String viewDataSetTable;
	private String globalTablename;


	GetStoryDetails()
	{
		propertiesMap= OdataUtility.getPropertiesMap();
		viewDataSetTable= propertiesMap.get("viewDataSetTable");
		globalTablename = propertiesMap.get("globalTablename");
	}

	/**
	 * getAllCommonStory method used to get all common story.
	 * 
	 * @param userName
	 *            Logedin user
	 * @param connection
	 *            Database connection
	 * @return
	 *			  Return status code.
	 */
	@SuppressWarnings("resource")
	public int getAllCommonStory(String userName, Connection connection)
	{

		String commonStoryViewName= propertiesMap.get("commonStoryViewName");
		int status= HttpServletResponse.SC_OK;
		ResultSet res= null;
		Statement stmt= null;
		String itemUuid;
		ArrayList<String> itemUuidArray= new ArrayList<String>();
		String storeProcedure;
		String returnJsonData= null;
		String jsonPrefix= "{ \"CommonStories\": [";
		String jsonData= null;
		try
		{
			stmt= connection.createStatement();

			String deleteDataGlobalTempTable= "DELETE FROM "+ globalTablename;
			stmt.executeUpdate(deleteDataGlobalTempTable);

			String queryUuid= "SELECT ITEM_UUID from  " + "\"" + viewDataSetTable + "\"" + " WHERE PARENT_UUID = '" + commonStoryViewName + "'";

			res= stmt.executeQuery(queryUuid);
			while(res.next())
			{
				itemUuid= res.getString("ITEM_UUID");
				itemUuidArray.add(itemUuid);
			}
			for(int i= 0; i < itemUuidArray.size(); ++i)
			{
				storeProcedure= "CALL \"sap.bi.launchpad.db.procedures::GET_HANALYTIC_DATA\"('" + userName + "', '" + itemUuidArray.get(i) + "',?," + globalTablename + ") with overview";
				stmt.execute(storeProcedure);
			}
			String uuidValue= null;
			for(int j= 0; j < itemUuidArray.size(); ++j)
			{
				if(uuidValue == null)
				{
					uuidValue= "'" + itemUuidArray.get(j) + "'";
				}
				else
				{
					uuidValue+= "'" + itemUuidArray.get(j) + "'";
				}
				if(j < itemUuidArray.size() - 1)
					uuidValue+= ",";
			}

			String queryGlobalTable= "SELECT * FROM " + globalTablename + " WHERE UUID IN (" + uuidValue + ")";
			res= stmt.executeQuery(queryGlobalTable);
			returnJsonData= convertResulsetToJson(res);
			jsonData= jsonPrefix + returnJsonData + "]}";
			OdataUtility.responseMessage= jsonData;
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		finally
		{
			OdataUtility.safeClose(res);
			OdataUtility.safeClose(stmt);
		}
		return status;

	}
	
	/**
	 * getAllCustomStory method used to get all custom story.
	 * 
	 * @param userName
	 *            Logedin user
	 * @param connection
	 *            Database connection
	 * @return
	 *			  Return status code.
	 */
	@SuppressWarnings("resource")
	public int getAllCustomStory(String productName, String userName, Connection connection)
	{

		int status= HttpServletResponse.SC_OK;
		String viewPrefix= "sap.pia.usagecloud.views:UT_AV_";
		ResultSet res= null;
		Statement stmt= null;
		String itemUuid;
		ArrayList<String> itemUuidArray= new ArrayList<String>();
		String pkname= productName.replaceAll("\\s", "_");
		String viewName= viewPrefix + pkname;
		String storeProcedure;
		String returnJsonData= null;
		String jsonPrefix= "{ \"customStories\": [";
		String jsonData= null;
		try
		{
			stmt= connection.createStatement();

			String deleteDataGlobalTempTable= "DELETE FROM "+ globalTablename;
			stmt.executeUpdate(deleteDataGlobalTempTable);

			String queryUuid= "SELECT ITEM_UUID from  " + "\"" + viewDataSetTable + "\"" + " WHERE PARENT_UUID = '" + viewName + "'";

			res= stmt.executeQuery(queryUuid);
			while(res.next())
			{
				itemUuid= res.getString("ITEM_UUID");
				itemUuidArray.add(itemUuid);
			}
			for(int i= 0; i < itemUuidArray.size(); ++i)
			{
				storeProcedure= "CALL \"sap.bi.launchpad.db.procedures::GET_HANALYTIC_DATA\"('" + userName + "', '" + itemUuidArray.get(i) + "',?," + globalTablename + ") with overview";
				stmt.execute(storeProcedure);
			}
			String uuidValue= null;
			for(int j= 0; j < itemUuidArray.size(); ++j)
			{
				if(uuidValue == null)
				{
					uuidValue= "'" + itemUuidArray.get(j) + "'";
				}
				else
				{
					uuidValue+= "'" + itemUuidArray.get(j) + "'";
				}
				if(j < itemUuidArray.size() - 1)
					uuidValue+= ",";
			}

			String queryGlobalTable= "SELECT * FROM " + globalTablename + " WHERE UUID IN (" + uuidValue + ")";
			res= stmt.executeQuery(queryGlobalTable);
			returnJsonData= convertResulsetToJson(res);
			jsonData= jsonPrefix + returnJsonData + "]}";
			OdataUtility.responseMessage= jsonData;
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		finally
		{
			OdataUtility.safeClose(res);
			OdataUtility.safeClose(stmt);
		}
		return status;

	}

	/**
	 * convertResulsetToJson method used to convert ResultSet to String json format.
	 * 
	 * @param res
	 *            ResultSet
	 * @return
	 *			  Return story in json format.
	 */
	public String convertResulsetToJson(ResultSet res) throws SQLException
	{		
		String jsonFormatData=null;

		ResultSetMetaData resMetadata= res.getMetaData();
		int colCount= resMetadata.getColumnCount();
		String colValue;
		String colName;
		while(res.next())
		{
			if(jsonFormatData== null) {
				jsonFormatData= "{";
			}
			else {
				jsonFormatData+= "{";
			}
			
			for(int i= 1; i <= colCount; ++i)
			{
				colName= resMetadata.getColumnName(i);
				colValue= res.getString(colName);
				if(!(colName.equalsIgnoreCase("CDATA")))
				{
					jsonFormatData+= "\"" + colName + "\" :";
					jsonFormatData+= "\"" + colValue + "\"";
					jsonFormatData+= ",";

				}
			}
			jsonFormatData= jsonFormatData.substring(0, jsonFormatData.length() - 1);
			jsonFormatData+= "},";
		}
		jsonFormatData= jsonFormatData.substring(0, jsonFormatData.length() - 1);
		

		resMetadata= null;
		return jsonFormatData;

	}
}
