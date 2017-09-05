package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.SQLTimeoutException;
import java.util.Map;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletResponse;
import org.core4j.Enumerable;
import org.odata4j.core.OEntities;
import org.odata4j.core.OEntity;
import org.odata4j.core.OEntityKey;
import org.odata4j.core.OErrors;
import org.odata4j.edm.EdmDataServices;
import org.odata4j.edm.EdmEntitySet;
import org.odata4j.producer.EntityResponse;
import org.odata4j.producer.Responses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InsertData
{

	private String dataBase;
	private EdmDataServices metaDataObj;
	/** jdbc connection */
	private Connection connection;
	/** jdbc operation assistant */
	private JdbcOperator jdbc;
	private OdataDataDao odataDataDao;
	private String applicationTable;
	private String errorCustomDataInsertion;
	private String errorCustomTableCreation;
	private String errorApplicationDataInsertion;
	private String insertionError;

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(InsertData.class);

	InsertData(EdmDataServices metadata)
	{
		try
		{
			odataDataDao= new OdataDataDao();

			propertiesMap= OdataUtility.getPropertiesMap();
			dataBase= propertiesMap.get("dataBase");
			jdbc= new JdbcOperator();
			metaDataObj= metadata;
			applicationTable= propertiesMap.get("applicationTable");
			errorCustomTableCreation= propertiesMap.get("errorCustomTableCreation");
			errorCustomDataInsertion= propertiesMap.get("errorCustomDataInsertion");
			errorApplicationDataInsertion= propertiesMap.get("errorApplicationDataInsertion");
			insertionError= propertiesMap.get("insertionError");
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
	}

	/**
	 * addData method used to add new row into database table.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param entity
	 *            Table columns and values
	 * @return
	 *			  Return success and failure response.
	 */
	public EntityResponse addData(String entitySetName, OEntity entity)
	{

		EdmEntitySet ees= null;
		OEntity nEntity= null;
		OEntityKey entityKey= null;
		int status= 0;
		String errorNumber= "504";

		try
		{
			connection= odataDataDao.getConnection();
			ees= metaDataObj.getEdmEntitySet(entitySetName);
			entityKey= OEntityKey.create(ees.getType().getKeys().get(0));
			nEntity= OEntities.create(entity.getEntitySet(), entityKey, entity.getProperties(), entity.getLinks());

			if(entitySetName.equalsIgnoreCase("FORMULAMASTER"))
			{
				String appID= jdbc.getKeyValueFromEntity(entity, "APPLICATIONID");
				status= createCustomTable(appID, connection);
				if(status != HttpServletResponse.SC_OK)
				{
					throw new OdataException(OErrors.error(String.valueOf(status), errorCustomTableCreation, errorCustomTableCreation));
				}
				return Responses.entity(nEntity);
			}

			String names= Enumerable.create(jdbc.getNamesFromEntity(entity)).join(",");
			String values= Enumerable.create(jdbc.getValuesFromEntity(entity)).join(",");

			String sql= "INSERT INTO " + dataBase + "." + entitySetName + " (" + names + ") VALUES (" + values + ")";
			LOGGER.info("Query SQL: " + sql);
			odataDataDao.runSQL(sql, connection);

			if(entitySetName.equalsIgnoreCase(applicationTable))
			{
				String appID= jdbc.getKeyValueFromEntity(entity, "APPLICATIONID");
				addDefaultCustomData(appID, connection);
			}

		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			setErrorMessage(entitySetName);
			throw new OdataException(OErrors.error(errorNumber, insertionError, insertionError));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			setErrorMessage(entitySetName);
			throw new OdataException(OErrors.error(errorNumber, insertionError, insertionError));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			setErrorMessage(entitySetName);
			throw new OdataException(OErrors.error(errorNumber, insertionError, insertionError));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			setErrorMessage(entitySetName);
			throw new OdataException(OErrors.error(errorNumber, insertionError, insertionError));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			setErrorMessage(entitySetName);
			throw new OdataException(OErrors.error(errorNumber, insertionError, insertionError));
		}
		finally
		{
			OdataUtility.safeClose(connection);
		}
		return Responses.entity(nEntity);
	}

	
	/**
	 * addDefaultCustomData method used to add default custom columns into database table.
	 * 
	 * @param appID
	 *            Product application id
	 * @param connection
	 *            Database connection
	 * @return
	 *
	 * @throws ClassNotFoundException
	 *             Thrown when an application tries to load in a class through its string name but
	 *             no definition for the class with the specified name could be found.
	 *             
	 * @throws SQLIntegrityConstraintViolationException
	 *             An exception that provides information on a database access
	 *             error or other errors      
	 *                   
	 * @throws SQLException
	 *             An exception that provides information on a database access
	 *             error or other errors         			 
	 */
	void addDefaultCustomData(String appID, Connection connection) throws SQLIntegrityConstraintViolationException, ClassNotFoundException, SQLException
	{

		String customKeyNames[];
		String strCustomKeyNames= propertiesMap.get("customKeyName");

		customKeyNames= strCustomKeyNames.split(",");

		for(int i= 0; i < customKeyNames.length; ++i)
		{
			String strNames[]= customKeyNames[i].split(" ");
			String strColName;
			String strDataType;

			strColName= strNames[0];
			strDataType= strNames[1];

			String query= "INSERT INTO SAP_PIA_USAGECLOUD.CUSTOMCOLUMNMETADATA (ID,CUSTOMKEYNAME,CUSTOMKEYDATATYPEID,applicationid, CustomKeyAnalyticTypeID,CUSTOMKEYDATALENGTH) VALUES ('1','" + strColName + "','" + strDataType + "','" + appID + "', 2,50)";
			odataDataDao.runSQL(query, connection);

		}
	}

	/**
	 * createCustomTable method used to create custom table for a given application id.
	 * 
	 * @param appID
	 *            Product application id
	 * @param connection
	 *            Database connection
	 * @return
	 *
	 * @throws ClassNotFoundException
	 *             Thrown when an application tries to load in a class through its string name but
	 *             no definition for the class with the specified name could be found.
	 *             
	 * @throws SQLIntegrityConstraintViolationException
	 *             An exception that provides information on a database access
	 *             error or other errors      
	 *                   
	 * @throws SQLException
	 *             An exception that provides information on a database access
	 *             error or other errors         			 
	 */
	private int createCustomTable(String appID, Connection connection) throws SQLIntegrityConstraintViolationException, ClassNotFoundException, SQLException
	{
		String tableName= "SAP_PIA_USAGECLOUD." + "\"UT_" + appID + "\"";
		String query= "";
		String tableData= "";
		int status= HttpServletResponse.SC_OK;
		String recordIDColumn= "RecordID bigint PRIMARY KEY";

		try
		{
			String sql= "SELECT CUSTOMKEYNAME, CUSTOMKEYDATATYPEID FROM SAP_PIA_USAGECLOUD.CUSTOMCOLUMNMETADATA where APPLICATIONID = " + "'" + appID + "'";
			tableData= odataDataDao.executeSelectQuery(sql, connection);
			String tableDataReplaced= tableData.replaceAll("VARCHAR", "VARCHAR(2000)");

			tableDataReplaced+= recordIDColumn;

			query= "CREATE COLUMN TABLE " + tableName + "( " + tableDataReplaced + " )";
			odataDataDao.runSQL(query, connection);
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage= errorCustomTableCreation;
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage= errorCustomTableCreation;
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage= errorCustomTableCreation;
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage= errorCustomTableCreation;
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			OdataUtility.responseMessage= errorCustomTableCreation;
		}
		finally
		{

		}
		return status;
	}

	private void setErrorMessage(String entitySetName)
	{
		if(entitySetName.equalsIgnoreCase("CUSTOMCOLUMNMETADATA"))
		{
			insertionError= errorCustomDataInsertion;
		}
		if(entitySetName.equalsIgnoreCase("APPLICATION"))
		{
			insertionError= errorApplicationDataInsertion;
		}
	}

}
